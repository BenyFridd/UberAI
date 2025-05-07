from pydantic_ai import Agent, RunContext
from agents.common_models import FilterData
import json

product_filter_agent = Agent(
    'openai:gpt-4o-mini',
    deps_type=None,
    result_type=FilterData,
    system_prompt=(
        'Você é um assistente especializado em filtrar produtos de supermercado que não são relevantes para os itens da lista de compras. '
        'Sua tarefa é avaliar todos os produtos encontrados para cada item da lista e remover aqueles que definitivamente não correspondem ao item buscado, '
        'considerando o contexto expandido do item (sinônimos, categorias e descrição). '
        'Mantenha apenas os produtos que têm uma relação significativa com o item da lista. '
        'NÃO remova produtos apenas por diferenças de marca ou variações específicas que ainda atendem à necessidade básica do item. '
        'Processe todos os produtos encontrados em uma única vez. '
        'Você receberá os dados em formato JSON contendo as informações dos produtos encontrados e o contexto expandido. '
        'A estrutura dos dados recebidos será: {"query_item": "item_name", "matches": [...], "expanded_context": {...}}. '
        'IMPORTANTE: Sua resposta DEVE ser um JSON válido com EXATAMENTE esta estrutura: {"matches": [...]}. '
        'O campo "matches" deve ser uma lista de produtos filtrados, onde cada produto é um dicionário com os campos: '
        'product_id, name, price, description, category, similarity, nome_mercado. '
        'NÃO inclua nenhum outro campo além de "matches". '
        'NÃO altere a estrutura do JSON, apenas remova os produtos irrelevantes dentro da lista "matches". '
        'IMPORTANTE: Certifique-se de que o JSON retornado não contenha caracteres de controle ou caracteres especiais. '
        'Use apenas caracteres ASCII padrão e escape corretamente qualquer caractere especial. '
        'SEJA MAIS RIGOROSO NA FILTRAGEM: '
        '- Para "leite", mantenha apenas produtos que são claramente leite (líquido ou em pó) '
        '- Remova produtos como creme de leite, leite condensado, leite fermentado, etc. '
        '- Remova produtos que são apenas relacionados ao leite mas não são leite em si '
        '- Mantenha apenas produtos que atendem diretamente à necessidade de leite'
    )
) 