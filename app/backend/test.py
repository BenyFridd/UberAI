import asyncio
import json
import traceback
from typing import List, Dict, Any, Optional, Tuple
from pydantic import BaseModel
from rich.console import Console
from rich.panel import Panel
from dotenv import load_dotenv
from pydantic_ai import Agent, RunContext

# Load environment variables
load_dotenv()

from agents.common_models import GroceryList, GroceryItem, IntentResult
from retrieval.hybrid_retrieval import (
    hybrid_product_retrieval,
    load_processed_data,
    display_final_results,
)
from utils.format_result import format_results_as_json


console = Console()

# Initialize global answer variable
answer = None


# Define the main conversational agent
grocery_assistant = Agent(
    'openai:gpt-4o',  # Using a more capable model for the main agent
    deps_type=None,
    result_type=str,  # Simple string responses for user interaction
    system_prompt=(
        "Você é um assistente de compras inteligente. Você pode ajudar os usuários a:\n"
        "1. Criar listas de compras a partir de descrições de eventos (ex: 'vou fazer um churrasco')\n"
        "2. Buscar produtos nos supermercados\n"
        "3. Sugerir pratos que podem ser preparados com os itens da lista\n"
        "Sempre que um usuário enviar uma lista você deve recomendar pratos que podem ser preparados com os itens da lista e os itens complementares,"
        "Pergunte para o usuário se ele deseja adicionar os itens sugeridos à sua lista."
        "Depois disso, pergunta se pode ser feita a busca de produtos no supermercado"
    )
)

# Tool 1: Product Search
@grocery_assistant.tool
async def search_products(ctx: RunContext, grocery_list_json: str) -> Dict[str, Any]:
    """
    Busca produtos nos supermercados com base na lista de compras.
    Entrada esperada: lista de compras no formato JSON.
    """
    global answer
    try:
        # Parse the JSON string back to a GroceryList
        data = json.loads(grocery_list_json)
        grocery_list = GroceryList.model_validate(data)
        
        # Load data and perform search
        df_with_embeddings, category_embeddings = load_processed_data()
        if df_with_embeddings is None or category_embeddings is None:
            return {"error": "Falha ao carregar dados de produtos"}
        
        results = await hybrid_product_retrieval(grocery_list, df_with_embeddings, category_embeddings)
        json_results, not_found = format_results_as_json(results)

        answer = json_results
        
        return {
            "results": json_results,
            "not_found": not_found
        }
    except Exception as e:
        return {"error": f"Erro ao buscar produtos: {str(e)}"}


# Tool for suggesting dishes and complementary ingredients
@grocery_assistant.tool
async def suggest_dishes(ctx: RunContext, grocery_list: str) -> str:
    """
    Sugere pratos que podem ser preparados com os itens da lista e ingredientes complementares.
    Utiliza o recommendation_agent para gerar sugestões contextualizadas.
    """
    try:
        from agents.recommendation_agent import recommendation_agent

        print('vai rodar o recommendation agent') 
        # Get recommendations from the specialized agent
        recommendations = await recommendation_agent.run(grocery_list)
        print(recommendations)
       
        
        return recommendations
    except Exception as e:
        print(f"Error in suggest_dishes: {str(e)}")
        print(traceback.format_exc())
        return f"Não foi possível gerar recomendações: {str(e)}"


# Main function
async def main():
    global answer
    console.print("[bold green]Sistema de Assistente de Compras[/]")
    console.print("Digite 'sair' para encerrar a sessão.")
    
    # Load product data
    console.print("[bold blue]Inicializando o sistema de busca...[/]")
    df_with_embeddings, category_embeddings = load_processed_data()
    if df_with_embeddings is None or category_embeddings is None:
        console.print("[red]Erro ao carregar os dados pré-processados.[/]")
        return
    
    # Initialize conversation thread to maintain context
    thread = None
    
    # Conversation loop
    while True:
        user_message = input("Você: ")
        if user_message.lower() == 'sair':
            break
            
        try:
            # Use thread for context if it exists, otherwise start fresh
            if thread is not None:
                response = await grocery_assistant.run(user_message, message_history=thread)
            else:
                response = await grocery_assistant.run(user_message)
                
            # Store or update the thread from the response
            thread = response.all_messages()
            
            if answer is not None:
                console.print(Panel(str(answer), title="Resultados", expand=False))
                answer = None
            else:
                # Extract string data from the response object
                response_text = response.data if hasattr(response, 'data') else str(response)
                console.print(Panel(response_text, title="Assistente", expand=False))
            
        except Exception as e:
            console.print(f"[red]Erro no processamento: {str(e)}[/]")
            console.print(traceback.format_exc())
            # Don't update thread on error to maintain previous context
    
    console.print("[bold green]Obrigado por usar nosso sistema![/]")

if __name__ == "__main__":
    asyncio.run(main())