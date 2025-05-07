import json
from typing import Dict, Any, Optional, List
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from contextlib import asynccontextmanager
import traceback

from pydantic_ai import Agent, RunContext

# Load environment variables
load_dotenv()

from agents.common_models import GroceryList
from retrieval.hybrid_retrieval import hybrid_product_retrieval, load_processed_data
from utils.format_result import format_results_as_json, format_results_for_frontend

app = FastAPI(title="Grocery Assistant API", description="API for grocery shopping assistance")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageRequest(BaseModel):
    message: str

#-------------------------------- Inicialização --------------------------------
df_with_embeddings, category_embeddings = load_processed_data()

#-------------------------------- Agente de compras --------------------------------
thread = None
product_search_response = None

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
    global product_search_response
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

        # Format results for frontend
        formatted_results = format_results_for_frontend(json_results)
        product_search_response = formatted_results
        
        return {
            "results": results,
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


#-------------------------------- API --------------------------------


@app.post("/chat")
async def create_grocery_list(request: MessageRequest):
    global product_search_response
    global thread
    
    if df_with_embeddings is None or category_embeddings is None:
        return
        
    try:
        # Use thread for context if it exists, otherwise start fresh
        if thread is not None:
            response = await grocery_assistant.run(request.message, message_history=thread)
        else:
            response = await grocery_assistant.run(request.message)
            
        # Store or update the thread from the response
        thread = response.all_messages()
        
        if product_search_response is not None:
            final_response = product_search_response
            # Reset product_search_response after sending it
            product_search_response = None
        else:
            final_response = response.data if hasattr(response, 'data') else str(response)
            
        
    except Exception as e:
        return f"[red]Erro no processamento: {str(e)}[/]"



    return {"message": final_response}




if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 