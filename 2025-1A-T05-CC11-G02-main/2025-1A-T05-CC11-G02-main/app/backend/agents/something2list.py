from pydantic_ai import Agent, RunContext
from agents.common_models import GroceryItem, GroceryList

something2list_agent = Agent(
    'openai:gpt-4o-mini',
    deps_type=None,
    result_type=GroceryList,
    system_prompt=(
        "Você é um especialista em transformar descrições de eventos em listas de compras inteligentes. "
        "Dada uma descrição de um evento ou situação, retorne os itens essenciais que a pessoa precisará comprar. "
        "Ignore quantidades, medidas e detalhes específicos; retorne apenas o nome genérico dos produtos. "
        "Exemplo: para 'Hoje vou fazer uma festa de aniversário para 10 crianças', retorne:\n"
        "{\"items\": [{\"name\": \"bolo\"}, {\"name\": \"balas\"}, {\"name\": \"chocolates\"}, "
        "{\"name\": \"chapéus de festa\"}, {\"name\": \"copos descartáveis\"}, {\"name\": \"pratos descartáveis\"}, "
        "{\"name\": \"refrigerante\"}]}."
    )
)

@something2list_agent.tool
async def process_event_description(ctx: RunContext, text: str) -> str:
    return f"Transforme a seguinte descrição de evento em uma lista de compras: {text}"
