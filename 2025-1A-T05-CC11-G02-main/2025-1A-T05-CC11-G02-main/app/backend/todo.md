Melhorar recomendação
Não precisa ser tantas variacoes da mesma coisa
A intenção tem que ser mais bem escrita pois ela vai ser enviada na mensagem para o usuário
Não precisa recomendar tanta coisa, tem que ser pouco na realidade
```
Digite uma pergunta ou sua lista de compras (separada por vírgulas):
> pão, queijo, presuto, leite, toddy
Processando sua lista de compras...
╭─────────────── Recomendação 1 ───────────────╮
│ Possível Intenção 1: Preparo de um sanduíche │
│ Baseado nos itens: pão, queijo, presunto     │
│ Recomendações: mostarda, ketchup, maionese   │
╰──────────────────────────────────────────────╯
╭────────────── Recomendação 2 ───────────────╮
│ Possível Intenção 2: Tomar chocolate quente │
│ Baseado nos itens: leite, chocolate em pó   │
│ Recomendações: marshmallows, chantilly      │
╰─────────────────────────────────────────────╯
╭───────────── Recomendação 3 ─────────────╮
│ Possível Intenção 3: Fazer misto quente  │
│ Baseado nos itens: pão, queijo, presunto │
│ Recomendações: manteiga, orégano         │
╰──────────────────────────────────────────╯
╭───────────────── Recomendação 4 ──────────────────╮
│ Possível Intenção 4: Preparar leite com chocolate │
│ Baseado nos itens: leite, chocolate em pó         │
│ Recomendações: açúcar, cookies                    │
╰───────────────────────────────────────────────────╯
```

---

list to list agent
Pão, queijo -> pao de queijo

```
Sistema de Busca de Produtos
Digite uma pergunta ou sua lista de compras (separada por vírgulas):
> pão, queijo, presuto, leite, toddy

Correcting shopping list...
╭─ Corrected Shopping List ─╮
│ • pão de queijo           │
│ • presunto                │
│ • leite                   │
│ • chocolate em pó         │
╰───────────────────────────╯
```


--- output format:
```json
{
    "item1": [
      {
        "nome_produto": "...",
        "preco": 10.99,
        ...
      }
    ],
    "item2": [],  // Item not found in this supermarket
    "item3": [
      {
        "nome_produto": "...",
        "preco": 5.99,
        ...
      }
    ]
}
```

---

Não existe sal no BD

Resultados em JSON:
{
  "sal": [
    {
      "nome_produto": "Biscoito PANCO Salgado Wind Pacote 500g",
      "preco": 8.99,
      "descricao": "<b>Ingredientes:</b><br>Farinha de trigo enriquecida com ferro e ácido fólico, gordura vegetal, açúcar invertido, açúcar, sal refinado, extrato de 
malte, fermentos químicos bicarbonato de amônio, fosfato monocálcio e bicarbonato de sódio, estabilizante lecitina de soja, acidulante ácido cítrico, melhoradores de 
farinha protease e metabissulfito de sódio.<br><b>CONTÉM GLÚTEN.</b>",
      "categoria": "Biscoitos, salgadinhos e snacks|Biscoitos e bolachas|Biscoitos salgados|Alimentos",
      "similaridade": 0.3485894619416612
    }
  ]
}