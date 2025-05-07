from pydantic_ai import Agent, RunContext
from agents.common_models import IntentResult

intent_classifier_agent = Agent(
    'openai:gpt-4o-mini',
    deps_type=None,
    result_type=IntentResult,
    system_prompt=(
        "Você é um classificador inteligente de intenções. Dada uma entrada de texto, identifique se ela se refere a:\n"
        "1. Uma pergunta sobre como o sistema funciona – retorne 'helper'.\n"
        "2. Uma lista de compras já formatada (itens separados por vírgula) – retorne 'list_correction'.\n"
        "3. Uma descrição de um evento que precisa ser transformada em uma lista de compras – retorne 'something2list'.\n"
        "Exemplos:\n"
        "- 'Como o sistema funciona?' → 'helper'\n"
        "- 'bananas, maças, sabão em po' → 'list_correction'\n"
        "- 'Hoje vou fazer um churrasco com os amigos' → 'something2list'\n"
    )
)

@intent_classifier_agent.tool
async def classify_intent(ctx: RunContext, text: str) -> IntentResult:
    return f"Classifique a intenção da seguinte entrada: {text}"
