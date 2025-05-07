from fastapi import FastAPI
from pydantic import BaseModel
from main import main, get_recomendation
from agents.disambiguation_agent import disambiguation_agent
from typing import Optional

app = FastAPI()


# Definindo o modelo esperado no corpo da requisição
class Item(BaseModel):
    message: str

class RequestList(BaseModel):
    message: str
    recomendation_itens: Optional[str]
    

# Endpoint POST que recebe um JSON e retorna um JSON
@app.post("/valid/list2list")
async def get_item(item: Item):
    message = item.message

    # Executa o agente passando a mensagem como argumento posicional
    result = await disambiguation_agent.run(message)
    print(result)
    # Verifica se a lista de itens ambíguos (result.data.items) contém algum item.
    if result.data.items:  # Se houver itens ambíguos
        ambiguous_list = [x.name for x in result.data.items]
        return {
            "ambiguous": ambiguous_list
        }
    else:  # Se a lista estiver vazia, significa que não há itens ambíguos
        result_main = await get_recomendation(message)
        return {"user_list":item.message,"recomendation":result_main.data}


# Endpoint POST que recebe um JSON e retorna um JSON
@app.post("/confirm/list2list")
async def get_list(message: RequestList):
    result_main = await main(message)
    return result_main


if __name__ == '__main__':
    import uvicorn
    uvicorn.run("fast_api:app", host="0.0.0.0", port=3000, reload=True)
