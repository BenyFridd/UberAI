from pydantic_ai import Agent, RunContext
from agents.common_models import GroceryList

disambiguation_agent = Agent(
    "openai:gpt-4o-mini",
    deps_type=None,
    result_type=GroceryList,
    system_prompt="""
        Você é um assistente que identifica se algum item de uma lista de compras está
        ambiguamente especificado. Se estiver, retorne apenas o nome do item ambíguo.
        Caso contrário, não retorne nada.

        Exemplos de itens não ambíguos:
        - maçã
        - cebola
        - tomate
        - creme de pentear
        - creme de leite

        Exemplos de itens ambíguos:
        - creme (sem especificar se é de pentear, de leite, etc.)
        - shampoo (sem especificar o tipo)
        - carne (sem especificar se é frango, bovina, moída, etc.)
        - limpeza (sem especificar se é sabão em pó, detergente, etc.)

        Saída esperada:
        - Uma lista de strings com os itens que precisam de mais especificação, separados por vírgula.
    """
)
@disambiguation_agent.tool
async def check_ambiguous_items(ctx: RunContext, text: str) -> str:
    return f"""
        Considere a lista de itens: [{text}].
        Para cada item, verifique se ele é ambíguo de acordo com o prompt anterior.
        Se for ambíguo, liste o nome exato do item.
        Se não for, não inclua na lista final.
    """
      