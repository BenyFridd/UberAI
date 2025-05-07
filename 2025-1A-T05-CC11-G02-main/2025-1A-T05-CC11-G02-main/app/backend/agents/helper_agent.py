from pydantic_ai import Agent, RunContext
from pydantic import BaseModel

class HelperResponse(BaseModel):
    explanation: str

helper_agent = Agent(
    'openai:gpt-4o-mini',
    deps_type=str,
    result_type=HelperResponse,
    system_prompt=(
        'Você é um assistente especializado em explicar como o sistema de busca de produtos funciona. '
        'O sistema permite que os usuários insiram uma lista de compras e encontra produtos correspondentes '
        'em diferentes mercados, além de fazer recomendações inteligentes de produtos complementares. '
        'Explique de forma clara e amigável como o sistema funciona, suas capacidades e como pode ajudar '
        'o usuário a fazer suas compras de forma mais eficiente.'
    )
)

@helper_agent.tool
async def explain_system(ctx: RunContext, query: str) -> str:
    """Explain how the system works based on the user's query."""
    return (
        f"O usuário perguntou: '{query}'. Por favor, explique como o sistema funciona, "
        f"focando especialmente nos aspectos relevantes para esta dúvida."
    ) 