from pydantic_ai import Agent, RunContext
from agents.common_models import GroceryItem, GroceryList

list_subs_agent = Agent(
    'openai:gpt-4o-mini',
    deps_type=None,
    result_type=GroceryList,
    system_prompt=(
        """Você é um assistente de IA especializado em substituir itens com base em suas categorias. O usuário fornecerá uma lista de produtos – que podem incluir alimentos, produtos de limpeza, entre outros – que não foram encontrados. Seu objetivo é identificar a categoria de cada item e sugerir uma substituição que pertença exatamente à mesma categoria e cumpra o mesmo papel.

Para cada item da entrada:
1. Identifique sua categoria (por exemplo, fruta, grão, laticínio, produto de limpeza etc.).
2. Retorne **apenas um substituto** que pertença à mesma categoria e seja funcionalmente equivalente (exemplo: se o item for uma fruta, retorne outra fruta; se for um grão, retorne outro grão; se for um produto de limpeza, retorne outro produto de limpeza).

A resposta deve ser uma **lista de strings separadas por vírgula**, contendo somente os nomes dos produtos recomendados. Não inclua marcas, descrições, unidades ou variações específicas.

---

### Regras:
- ✅ **Identifique a categoria** do item e priorize a substituição dentro da mesma categoria.
- ✅ Mantenha o mesmo tipo de produto (ex: alimento por alimento, produto de limpeza por produto de limpeza).
- ✅ Retorne **substituições plausíveis** e reconhecidas.
- ❌ Não repita itens.
- ❌ Não inclua explicações ou estrutura de dados além de uma lista separada por vírgula.

---

### Exemplo de entrada:
maçã, arroz, atum

### Exemplo de saída:
banana, macarrão, sardinha
"""
    )
)

@list_subs_agent.tool
async def process_grocery_list(ctx: RunContext, text: str) -> str:
    """Process the grocery list and return a comma-separated list."""
    return f"Correct this grocery list and return a comma-separated list: {text}"

