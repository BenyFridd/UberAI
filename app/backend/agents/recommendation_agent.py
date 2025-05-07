from pydantic_ai import Agent, RunContext
from typing import List
from pydantic import BaseModel
from agents.common_models import GroceryItem, GroceryList

class SingleRecommendation(BaseModel):
    possible_intent: str
    supporting_items: List[str]
    recommended_items: List[str]

class RecommendationResponse(BaseModel):
    recommendations: List[SingleRecommendation]

recommendation_agent = Agent(
    'openai:gpt-4o-mini',
    deps_type=str,
    system_prompt=(
        'Você é um assistente especializado em analisar listas de compras e identificar uma única intenção clara do usuário, como um prato ou atividade específica que ele provavelmente está planejando. '
        'Com base nessa intenção, você sugere produtos complementares que sejam relevantes, úteis e incentivem a compra, criando uma experiência de compra mais completa e atraente. '
        '\n\nIMPORTANTE: '
        '- Identifique APENAS UMA intenção com base nos itens fornecidos. Escolha a intenção mais provável e específica, evitando suposições genéricas ou múltiplas possibilidades. '
        '- Por exemplo, se a lista contém macarrão, molho de tomate e carne moída, não assuma intenções vagas como "jantar italiano". Em vez disso, escolha algo claro como "massa a bolonhesa". '
        '- As recomendações devem ser NOMES DE PRODUTOS simples, sem descrições ou explicações, mas devem ser escolhidas para complementar a intenção de forma lógica e atrativa. '
        '- As sugestões devem incentivar a venda, incluindo itens que melhorem a experiência (ex.: um acompanhamento, uma bebida, um toque especial) e sejam fáceis de associar à intenção. '
        '\n\nExemplo: '
        '- Lista: ["pão", "hambúrguer", "queijo"] '
        '- Intenção identificada: "hambúrguer caseiro" '
        '- Produtos recomendados: ["ketchup", "batata frita", "picles", "refrigerante"] '
        '\n\nOutro exemplo: '
        '- Lista: ["macarrão", "molho de tomate", "carne moída"] '
        '- Intenção identificada: "massa a bolonhesa" '
        '- Produtos recomendados: ["queijo parmesão", "vinho tinto", "manjericão fresco"] '
    )
)

async def convert_grocery_list_to_string(grocery_list: GroceryList) -> str:
    """Convert a GroceryList to a comma-separated string."""
    return ", ".join(item.name for item in grocery_list.items)

@recommendation_agent.tool
async def analyze_grocery_list(ctx: RunContext, text: str) -> str:
    """Analyze the grocery list and return recommendations."""
    return (
        'Analise esta lista de compras e retorne APENAS um objeto JSON com múltiplas recomendações, '
        f'cada uma seguindo o formato especificado no prompt do sistema. Lista: {text}'
    ) 