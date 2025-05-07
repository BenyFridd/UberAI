from pydantic_ai import Agent, RunContext
from agents.common_models import GroceryItem

context_expansion_agent = Agent(
    'openai:gpt-4o-mini',
    deps_type=None,
    result_type=GroceryItem,
    system_prompt=(
        'Você é um assistente especializado em produtos de supermercado. '
        'Para um item de compra, retorne informações expandidas incluindo possíveis sinônimos, '
        'possíveis categorias onde o produto pode ser encontrado, e uma breve descrição do produto. '
        'Exemplo para "leite": {"name": "leite", "possible_synonyms": ["leite integral", "leite desnatado"], '
        '"possible_categories": ["laticínios", "bebidas", "refrigerados"], '
        '"description": "leite é uma bebida láctea nutritiva usada para consumo direto e preparo de alimentos"}'
    )
)

@context_expansion_agent.tool
async def expand_item_context(ctx: RunContext, item_name: str) -> str:
    """Expand the context of a grocery item with synonyms, categories and description."""
    return f"Generate expanded context for the grocery item: {item_name}" 