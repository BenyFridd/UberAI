

# Fluxo de Interação do Chat

Este documento descreve o fluxo da primeira iteração do cliente com o chat. Nele, o sistema solicita uma lista de ingredientes, trata ambiguidades de forma interativa e, ao final, pergunta se o usuário deseja apenas requisitar o que foi informado ou se quer receber também sugestões complementares.



## 1. Solicitação Inicial de Ingredientes

Na primeira interação, o cliente deve informar uma lista de ingredientes.

Se houver produtos com nomes ambíguos, o sistema pedirá mais detalhes.

![1744141701043](image/fluxo/1744141701043.png)

## 2. Tratamento de Ambiguidades

Caso algum produto da lista seja ambíguo, o sistema retorna solicitando mais informações para que o item seja melhor especificado:

Primeira iteração do cliente com o chat : vai ser pedido uma lista de ingradientes, se um dos produtos for ambiguo retornamos para mais detalhes

![1744141956856](image/fluxo/1744141956856.png)

### Refinamento do Prompt

Para resolver as ambiguidades, o prompt é reformulado com mais detalhes, permitindo que o cliente esclareça a sua intenção:

![1744142149878](image/fluxo/1744142149878.png)

## 3. Confirmação e Escolha do Fluxo de Resposta

Após coletar os detalhes e confirmar a lista de ingredientes, o sistema apresenta uma pergunta ao cliente para definir o fluxo a ser seguido. A pergunta pergunta se o cliente deseja apenas requisitar os itens informados ou se também quer receber uma lista de sugestões complementares.

### Cenário 1: Requisição Apenas dos Itens Informados

Caso o cliente não queira as sugestões adicionais, é utilizado um prompt específico para prosseguir apenas com a lista original:

![1744141724224](image/fluxo/1744141724224.png)

### Cenário 2: Inclusão de Sugestões

Se o cliente optar por receber sugestões, o sistema processa um prompt que adiciona as recomendações à lista de ingredientes:

![1744141755950](image/fluxo/1744141755950.png)
