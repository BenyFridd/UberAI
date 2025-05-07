from pydantic_ai import Agent, RunContext
from agents.common_models import GroceryItem, GroceryList

list_correction_agent = Agent(
    'openai:gpt-4o-mini',
    deps_type=None,
    result_type=GroceryList,
    system_prompt=(
        'Você é um assistente de lista de compras. Dada uma lista de itens separados por vírgula, '
        'retorne uma lista de nomes de produtos corrigidos. Corrija quaisquer erros de ortografia. '
        'Mantenha apenas nome genérico do produto, sem marcas ou especificações detalhadas. '
        'Exemplo de entrada: "bananas, maças, sabão em po" deve retornar: '
        '{"items": [{"name": "bananas"}, {"name": "maçãs"}, {"name": "sabão em pó"}]}'
    )
)

@list_correction_agent.tool
async def process_grocery_list(ctx: RunContext, text: str) -> str:
    """Process the grocery list and return a prompt for correction."""
    return f"Correct this grocery list and format as JSON array: {text}" 
