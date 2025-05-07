# Documentação Simplificada do Agente de Substituição

## Fluxo Básico de Operação

O agente funciona em 3 etapas principais:

1. **Busca inicial** - Procura os produtos solicitados
2. **Verificação de faltantes** - Identifica o que não foi encontrado
3. **Substituição recursiva** - Pede recomendações para os itens faltantes e repete o processo

## Implementação do Código

### Parte Principal

```
# Busca os produtos originais
products = buscar_produtos(itens_solicitados)

# Verifica itens faltantes
itens_faltantes = identificar_faltantes(itens_solicitados, products)

if itens_faltantes and not recursao_ativa:
    # Pede recomendações ao agente
    recomendacoes = agente.gerar_recomendacoes(itens_faltantes)
  
    # Chama recursivamente com as recomendações
    return buscar_produtos(recomendacoes, recursao_ativa=True)
```

### Função de Identificação de Faltantes

```
def identificar_faltantes(itens_solicitados, produtos_encontrados):
    # Normaliza nomes para comparação
    nomes_solicitados = [item.lower() for item in itens_solicitados]
    nomes_encontrados = [p.nome.lower() for p in produtos_encontrados]
  
    # Retorna os que não foram encontrados
    return [item for item in nomes_solicitados 
            if item not in nomes_encontrados]
```

## Exemplo Prático

### Caso 1: Sucesso na primeira tentativa

**Entrada:** ["leite", "ovos"]
**Saída:** Lista com leite e ovos encontrados

### Caso 2: Com substituição

**Entrada:** ["leite de amêndoa"] (não encontrado)
**Processo:**

1. Agente sugere ["leite de soja", "leite de aveia"]
2. Sistema busca por esses itens
3. Retorna os que encontrar (ex: leite de soja)

## Proteções Implementadas

1. **Flag de recursão** (`is_missing`): Evita loops infinitos
2. **Tratamento de erros** : Se não conseguir recomendações, informa ao usuário
3. **Limite implícito** : Só faz uma rodada de substituição

## Vantagens da Abordagem

* Simplicidade de implementação
* Resiliência a itens não disponíveis
* Extensível para diferentes lógicas de recomendação
* Não depende de sistemas complexos de ranking

## Código Completo Simplificado

```
def buscar_itens(itens_originais, agente, tentativa_substituicao=False):
    # 1. Busca inicial
    resultados = busca_banco_dados(itens_originais)
  
    # 2. Verifica faltantes
    faltantes = identificar_faltantes(itens_originais, resultados)
  
    if faltantes and not tentativa_substituicao:
        try:
            # 3. Gera recomendações
            substitutos = agente.recomendar(faltantes)
          
            # 4. Busca recursiva
            resultados_substitutos = buscar_itens(substitutos, agente, True)
          
            # Combina resultados
            return resultados + resultados_substitutos
        except:
            return resultados + ["⚠️ Não encontramos substitutos para: " + ", ".join(faltantes)]
  
    return resultados
```

Esta abordagem garante que o usuário sempre receba algum resultado relevante, mesmo que não seja exatamente o que solicitou originalmente.
