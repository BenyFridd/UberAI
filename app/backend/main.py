import asyncio
import json
import traceback
from typing import Optional, Union, List, Dict, Any, Tuple

from dotenv import load_dotenv
from pydantic import BaseModel
from rich.console import Console
from rich.panel import Panel

# Carregar variáveis de ambiente
load_dotenv()

# Importações dos agentes e módulos auxiliares
from agents.list_correction_agent import list_correction_agent
from agents.recommendation_agent import recommendation_agent, convert_grocery_list_to_string
from agents.helper_agent import helper_agent
from agents.common_models import GroceryList, GroceryItem
from agents.intent_classifier import intent_classifier_agent
from agents.something2list import something2list_agent
from agents.substituicao import list_subs_agent
from retrieval.hybrid_retrieval import (
    hybrid_product_retrieval,
    load_processed_data,
    display_final_results,
)
from utils.format_result import format_results_as_json

console = Console()

# ==================== ETAPA 1: CLASSIFICAÇÃO DA INTENÇÃO ====================
async def classify_intent(user_input: str) -> Tuple[str, Any]:
    console.print("[bold blue]Analisando a intenção da entrada...[/]")
    intent_result = await intent_classifier_agent.run(user_input)
    intent = intent_result.data.intent.strip().lower()
    console.print(f"[green]Intenção identificada:[/] {intent}")
    return intent, intent_result

# ==================== ETAPA 2: GERAÇÃO DA LISTA DE COMPRAS ====================
async def generate_grocery_list(user_input: str, intent: str) -> Optional[GroceryList]:
    if intent == "helper":
        console.print("[bold blue]Processando sua pergunta com o agente auxiliar...[/]")
        response = await helper_agent.run(user_input)
        console.print(Panel(response.data.explanation, title="Resposta", expand=False))
        return None
    elif intent == "something2list":
        console.print("[bold blue]Processando descrição do evento para gerar a lista de compras...[/]")
        corrected_list_response = await something2list_agent.run(user_input)
    elif intent == "list_correction":
        console.print("[bold blue]Corrigindo gramática e processando lista de compras...[/]")
        corrected_list_response = await list_correction_agent.run(user_input)
    else:
        console.print("[red]Intenção não reconhecida.[/]")
        return None
    return corrected_list_response.data

# ==================== ETAPA 3: GERAÇÃO DE RECOMENDAÇÕES ====================
async def generate_recommendations(grocery_list: GroceryList) -> Any:
    console.print("[bold blue]Gerando recomendações baseadas na sua lista...[/]")
    list_str = await convert_grocery_list_to_string(grocery_list)
    recommendations = await recommendation_agent.run(list_str)
    for i, rec in enumerate(recommendations.data.recommendations, 1):
        panel_content = (
            f"[bold]Possível Intenção {i}:[/] {rec.possible_intent}\n"
            f"[bold]Baseado nos itens:[/] {', '.join(rec.supporting_items)}\n"
            f"[bold]Recomendações:[/] {', '.join(rec.recommended_items)}"
        )
        console.print(Panel(panel_content, title=f"Recomendação {i}", expand=False))
    return recommendations

# ==================== ETAPA 4: BUSCA DE PRODUTOS ====================
async def retrieve_products(
    combined_list: GroceryList, df_with_embeddings: Any, category_embeddings: Any
) -> Dict[str, Any]:
    results = await hybrid_product_retrieval(combined_list, df_with_embeddings, category_embeddings)
    console.print("\n[bold]Resultados para sua lista de compras:[/]")
    display_final_results(results)
    return results

# ==================== ETAPA 5: PROCESSAMENTO DE SUBSTITUIÇÕES ====================
async def process_substitutions(
    missing_items: List[str], df_with_embeddings: Any, category_embeddings: Any
) -> Tuple[Dict[str, Any], List[str]]:
    console.print(f"[green]Itens ausentes:[/] {missing_items}")
    substitution_results = {}
    substitution_items = []
    if missing_items:
        subs_input_str = ", ".join(missing_items)
        subs_response = await list_subs_agent.run(subs_input_str)
        try:
            substitution_items = [item.name for item in subs_response.data.items if item.name]
        except Exception:
            substitution_items = (
                subs_response.data.substitutions
                if hasattr(subs_response.data, "substitutions")
                else []
            )
        if substitution_items:
            console.print(f"[green]Substituições sugeridas:[/] {', '.join(substitution_items)}")
            substitution_list = GroceryList(items=[GroceryItem(name=item) for item in substitution_items])
            substitution_results = await hybrid_product_retrieval(substitution_list, df_with_embeddings, category_embeddings)
            console.print("\n[bold]Resultados para substituições:[/]")
            display_final_results(substitution_results)
            substitution_results, _ = format_results_as_json(substitution_results)
            return {"substituition": substitution_results}, substitution_items
        else:
            console.print("[yellow]Nenhuma substituição encontrada.[/]")
            return {}, []
    else:
        console.print("[green]Todos os itens foram encontrados.[/]")
        return {}, []

# ==================== ETAPA 6: GERAÇÃO DA RESPOSTA FINAL ====================
def generate_final_response(
    json_results: Dict[str, Any],
    substitution_results: Dict[str, Any],
    not_found: List[str],
    substitution_items: List[str],
    recommendations: Any,
) -> Dict[str, Any]:
    final_list = {}
    for key, value in json_results.items():
        if not (isinstance(value, list) and not value):
            final_list[key] = value
    if "substituition" in substitution_results:
        for key, value in substitution_results["substituition"].items():
            if isinstance(value, list) and value:
                final_list[key] = value
    structured_response = {
        "not_found": not_found.copy(),
        "found": [],
        "substitute/changed": substitution_items,
        "recommendation": recommendations,
        "list": final_list,
    }
    for key, value in json_results.items():
        if isinstance(value, list) and not value:
            structured_response["not_found"].append(key)
        else:
            structured_response["found"].append(key)
    if recommendations and hasattr(recommendations, "data") and hasattr(recommendations.data, "recommendations"):
        recommendation_data = []
        for rec in recommendations.data.recommendations:
            recommendation_data.append(
                {
                    "possible_intent": rec.possible_intent,
                    "supporting_items": rec.supporting_items,
                    "recommended_items": rec.recommended_items,
                }
            )
        structured_response["recommendation"] = recommendation_data
    console.print("\n[bold]Resultados Finais:[/]")
    console.print(json.dumps(structured_response, indent=2, ensure_ascii=False))
    return structured_response

# ==================== FUNÇÃO PRINCIPAL ====================
async def main():
    console.print("[bold blue]Inicializando o sistema de busca híbrida...[/]")
    df_with_embeddings, category_embeddings = load_processed_data()
    if df_with_embeddings is None or category_embeddings is None:
        console.print("[red]Erro ao carregar os dados pré-processados.[/]")
        return

    console.print("\n[bold green]Sistema de Busca de Produtos[/]")
    console.print("Digite 'sair' para encerrar a sessão.")
    state = {'grocery_list': None, 'recommendations': None}

    while True:
        user_message = input("Você: ")
        if user_message.lower() == 'sair':
            break

        intent, _ = await classify_intent(user_message)

        if intent == "helper":
            answer = await helper_agent.run(user_message)
            console.print(Panel(answer.data.explanation, title="Resposta", expand=False))
            continue

        elif intent in ["something2list", "list_correction"]:
            grocery_list = await generate_grocery_list(user_message, intent)
            if grocery_list is None:
                continue
            state['grocery_list'] = grocery_list

            # Gerar e apresentar recomendações
            recommendations = await generate_recommendations(grocery_list)
            state['recommendations'] = recommendations

            # Perguntar se o usuário quer adicionar as recomendações
            user_response = input("Deseja adicionar essas recomendações à sua lista? (sim/não): ")
            if user_response.lower() == "sim":
                for rec in recommendations.data.recommendations:
                    for item in rec.recommended_items:
                        state['grocery_list'].items.append(GroceryItem(name=item))

            # Permitir adicionar mais itens
            while True:
                user_more = input("Você tem mais itens para adicionar? (sim/não): ")
                if user_more.lower() == "sim":
                    additional_items = input("Liste os itens adicionais (separados por vírgula): ")
                    new_items = [GroceryItem(name=item.strip()) for item in additional_items.split(',')]
                    state['grocery_list'].items.extend(new_items)
                else:
                    break

            # Buscar produtos e processar substituições
            results = await retrieve_products(state['grocery_list'], df_with_embeddings, category_embeddings)
            json_results, not_found = format_results_as_json(results)
            substitution_results, substitution_items = await process_substitutions(not_found, df_with_embeddings, category_embeddings)
            final_response = generate_final_response(json_results, substitution_results, not_found, substitution_items, state['recommendations'])
            state['grocery_list'] = None  # Resetar para próxima lista

        else:
            console.print("Intenção não reconhecida. Envie uma lista ou descreva um evento.")

    console.print("[bold green]Obrigado por usar nosso sistema![/]")

if __name__ == "__main__":
    asyncio.run(main())