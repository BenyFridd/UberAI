# Importação de Modelos Abertos

### Objetivo
Identificar grandes modelos de linguagem (LLMs) gratuitos e de código aberto para execução local em PCs típicos (Intel Core i5, 16GB RAM, 512GB SSD, gráficos integrados), equilibrando eficiência de recursos e capacidades de agente (reconhecimento de intenções, orquestração de ações, estruturação de dados).

### Modelo Principal Implementado

**LLaMA 3**
- **Versão**: 3.2 (configurada como default_model no sistema)
- **Parâmetros**: 8 bilhões
- **Requisitos**: CPU moderna, 16GB RAM com quantização, GPU opcional
- **Referência**: [Llama 3 Requirements](https://www.hardware-corner.net/guides/computer-to-run-llama-ai-model/)
- **Justificativa**: Alta capacidade de agente (AlpacaEval ~7,5), execução eficiente em PCs padrão com quantização

### Modelos Recomendados, Referências e Justificativas

1. **Phi-3 Mini**
   - **Parâmetros**: 3,8 bilhões
   - **Requisitos**: CPU moderna, 8GB RAM com quantização (int4, ~1,78GB), poucos GB de armazenamento
   - **Referência**: [microsoft/Phi-3-mini-128k-instruct - Hugging Face](https://huggingface.co/microsoft/Phi-3-mini-128k-instruct)
   - **Justificativa**: Tamanho pequeno e eficiência em recursos permitem execução em PCs modestos e até dispositivos móveis. Forte em tarefas de agente (AlpacaEval ~7,0), ideal para usuários com hardware limitado.

2. **Mistral-7B**
   - **Parâmetros**: 7 bilhões
   - **Requisitos**: CPU moderna, 16GB RAM com quantização, GPU opcional (6GB VRAM)
   - **Referência**: [Mistral 7B System Requirements](https://www.oneclickitsolution.com/centerofexcellence/aiml/run-mistral-7b-locally-hardware-software-specs)
   - **Justificativa**: Equilibra eficiência e desempenho (AlpacaEval ~7,0), com forte seguimento de instruções e compatibilidade com PCs típicos, beneficiando-se de GPU para inferência mais rápida.

3. **LLaMA 3 8B**
   - **Parâmetros**: 8 bilhões
   - **Requisitos**: CPU moderna, 16GB RAM com quantização, GPU opcional
   - **Referência**: [Llama 2 and Llama 3.1 Hardware Requirements](https://www.hardware-corner.net/guides/computer-to-run-llama-ai-model/)
   - **Justificativa**: Alta capacidade de agente (AlpacaEval ~7,5), roda bem em PCs padrão com quantização, sendo flexível com gráficos integrados, mas melhora com GPU.

4. **DeepSeek-R1 8B**
   - **Parâmetros**: 8 bilhões
   - **Requisitos**: CPU moderna, 16GB RAM com quantização, GPU recomendada (8GB VRAM)
   - **Referência**: [DeepSeek R1 Hardware Requirements](https://www.geeky-gadgets.com/hardware-requirements-for-deepseek-r1-ai-models/)
   - **Justificativa**: Focado em raciocínio (AlpacaEval ~7,2), compatível com PCs típicos em CPU, mas desempenho ótimo requer GPU, adequado para tarefas complexas.

---

### Tabela de Comparação

| Modelo         | Parâmetros (B) | RAM Mínima (com quantização) | GPU | Capacidades de Agente (AlpacaEval) | Compatível com PC Típico | Referência Principal                                      |
|----------------|----------------|-----------------------------|-----|------------------------------------|--------------------------|----------------------------------------------------------|
| Phi-3 Mini     | 3,8            | 8GB                         | Não | ~7,0                               | Sim, altamente eficiente | [Hugging Face Phi-3](https://huggingface.co/microsoft/Phi-3-mini-128k-instruct) |
| Mistral-7B     | 7              | 16GB                        | Opcional (6GB VRAM) | ~7,0                    | Sim, pequenas concessões | [Mistral Requirements](https://www.oneclickitsolution.com/centerofexcellence/aiml/run-mistral-7b-locally-hardware-software-specs) |
| LLaMA 3 8B     | 8              | 16GB                        | Opcional | ~7,5                          | Sim, pequenas concessões | [Llama Requirements](https://www.hardware-corner.net/guides/computer-to-run-llama-ai-model/) |
| DeepSeek-R1 8B | 8              | 16GB                        | Recomendada (8GB VRAM) | ~7,2                 | Sim, melhor com GPU      | [DeepSeek Requirements](https://www.geeky-gadgets.com/hardware-requirements-for-deepseek-r1-ai-models/) |

---

### Outros Modelos Analisados

- **LLaMA 2 7B**: 7B, 16GB RAM, GPU opcional, AlpacaEval ~6,5 ([Llama Requirements](https://www.hardware-corner.net/guides/computer-to-run-llama-ai-model/)) – Menos eficiente que LLaMA 3.
- **Falcon 7B**: 7B, 16GB RAM, GPU opcional, AlpacaEval ~6,0 ([Falcon Requirements](https://www.hardware-corner.net/llm-database/Falcon/)) – Desempenho mediano.
- **MPT 7B**: 7B, 16GB RAM, GPU opcional, AlpacaEval ~5,5 ([MPT Intro](https://www.reddit.com/r/MachineLearning/comments/138sdwu/n_introducing_mpt7b_a_new_standard_for_opensource/)) – Adequado para uso comercial.
- **GPT-J 6B**: 6B, 16GB RAM, GPU opcional, AlpacaEval ~5,0 ([GPT-J Memory](https://discuss.huggingface.co/t/memory-use-of-gpt-j-6b/10078)) – Menos potente.
- **StableLM 7B**: 7B, 16GB RAM, GPU opcional, AlpacaEval ~6,0 ([StableLM Guide](https://www.reddit.com/r/StableLM/comments/12s8t0e/very_simple_guide_for_installing_stablelm/)) – Respostas estáveis.
- **Dolly 12B**: 12B, 24GB RAM, GPU necessária, AlpacaEval ~7,0 ([Dolly GPU](https://huggingface.co/databricks/dolly-v2-12b/discussions/9)) – Exige hardware avançado.

---

### Arquitetura de Providers Implementada

O sistema implementa uma arquitetura flexível que suporta múltiplos provedores LLM através da classe base `LLMProvider`:

1. **OllamaProvider**
   - Implementação local via Ollama API
   - Configuração padrão através de Docker (host.docker.internal:11434)
   - Suporte ao LLaMA 3.2 e outros modelos Ollama

2. **OpenAIProvider**
   - Integração com API OpenAI
   - Requer OPENAI_API_KEY como variável de ambiente
   - Suporte aos modelos GPT

3. **DeepSeekProvider**
   - Integração com API DeepSeek
   - Requer DEEPSEEK_API_KEY como variável de ambiente
   - Suporte aos modelos DeepSeek

### Configuração e Uso

A configuração dos providers é gerenciada através do arquivo YAML:

```yaml
default_provider: "ollama"
default_model: "llama3.2"
default_system_prompt: "You are a helpful assistant."

providers:
  ollama:
    host: "host.docker.internal"
    port: 11434
  # Configurações adicionais para outros providers

```

### Conclusão
- **Phi-3 Mini**: Melhor para PCs com recursos limitados devido à baixa demanda de RAM e alta eficiência.
- **Mistral-7B e LLaMA 3 8B**: Ideais para PCs típicos com 16GB RAM, oferecendo forte desempenho de agente.
- **DeepSeek-R1 8B**: Recomendado para tarefas de raciocínio, preferencialmente com GPU.

[Conteúdo anterior do documento...]

### Referências de Código

- **Implementação Principal**: `src/backend/llms/llm_provider.py` - Contém toda a lógica dos providers LLM
- **Configuração**: `src/backend/config/llm_config.yaml` - Arquivo de configuração dos providers e modelos
- **Classes Principais**:
  - `LLMProvider` - `src/backend/llms/llm_provider.py:1-5` - Classe base abstrata
  - `OllamaProvider` - `src/backend/llms/llm_provider.py:7-89` - Provider para Ollama (LLaMA 3.2)
  - `OpenAIProvider` - `src/backend/llms/llm_provider.py:91-134` - Provider para OpenAI
  - `DeepSeekProvider` - `src/backend/llms/llm_provider.py:136-180` - Provider para DeepSeek
- **Funções Utilitárias**:
  - `get_llm_provider()` - `src/backend/llms/llm_provider.py:182-196` - Factory para criação de providers
  - `load_llm_config()` - `src/backend/llms/llm_provider.py:202-237` - Carregamento de configurações
  - `get_provider()` - `src/backend/llms/llm_provider.py:239-284` - Obtenção de provider configurado


### Citações Adicionais
- [11 Melhores LLMs de Código Aberto para 2025 – n8n Blog](https://blog.n8n.io/open-source-llm/)
- [Phi-3 da Microsoft](https://www.analyticsvidhya.com/blog/2024/05/phi-3-small-yet-powerful-models-from-microsoft/)
- [Llama 3 Localmente](https://getdeploying.com/guides/local-llama)
- [DeepSeek R1 Features](https://www.datacamp.com/blog/deepseek-r1)
- [Mistral 7B Benchmarks](https://docs.mistral.ai/getting-started/models/benchmark/)

---

# Implementação do RAG e VectorDB

Este documento detalha a implementação do **Retrieval-Augmented Generation (RAG)** e do **VectorDB** para aprimorar a qualidade da recuperação e geração de respostas. 

## Implementação do VectorDB

A classe `VectorDB` gerencia um banco de dados vetorial, permitindo:

- Criar o banco de dados e definir o schema.
- Popular o banco com vetores e IDs do banco relacional.
- Realizar buscas de similaridade.
- Persistir (salvar/carregar) o índice.

### **Estrutura da Classe**

A classe `VectorDB` encapsula as seguintes funcionalidades:

- **creatDb:** Cria a instância do banco de dados.
- **create_collection:** Cria a coleção dentro do banco de dados.
- **get_vector:** Realiza consultas de similaridade e retorna os vetores mais próximos.
- **get_all:** Retorna todos os dados armazenados no banco vetorial.
- **close:** Fecha a conexão com o banco de dados.

### **Fluxo de População do Banco Vetorial**

- No método `store_embedding`, populamos o banco vetorial associando os embeddings ao banco relacional SQLite.
- Cada produto recebe um embedding gerado a partir de `{nome_do_produto} - {descricao}`.
- O embedding é salvo simultaneamente no banco vetorial e no SQLite para garantir a correlação dos dados.
- Um loop percorre cada documento, gera seu embedding e insere as informações nos dois bancos.

### **Fluxo de Busca por Similaridade**

1. **Inicialização**: O banco vetorial é criado e a coleção é configurada.
2. **Processamento**: Para cada item na lista de compras:
   - O nome do produto é normalizado.
   - O embedding da query é calculado.
   - A busca de similaridade é realizada com `get_vector`.
   - Os resultados são filtrados para manter apenas correspondências relevantes.
3. **Integração com Banco Relacional**: Os IDs dos vetores similares são usados para recuperar os dados completos dos produtos no SQLite.

Para mais detalhes sobre a implementação do VectorDB, consulte o arquivo `README.md` em `src/backend/infra/`.

# Implementação da API de Avaliação com RAGAS e Testes Automatizados

## Objetivo
Integrar a API RAGAS para avaliação automática das respostas geradas pelo modelo, garantindo a qualidade da recuperação e geração de textos. Além disso, foram adicionados testes automatizados com `pytest` para validar a confiabilidade do sistema.

---

### **Avaliação com RAGAS**
- **Arquivo:** `src/backend/tests/rag_evaluation.py`
- **Funções:**
  - `evaluate_retrieval()`: Avalia a recuperação de documentos no contexto da consulta do usuário.
  - `evaluate_generation()`: Avalia a fidelidade e relevância das respostas geradas pelo LLM.
- **Saída:**
  - Resultados armazenados no arquivo CSV `ragas_results.csv`.

### **Integração com Banco Vetorial**
- **Arquivo:** `src/backend/infra/vectorDB.py`
- **Função Integrada:**
  - `evaluate_retrieval()` agora é utilizada para analisar os documentos recuperados pelo banco vetorial.

### **API de Comunicação com LLM**
- **Arquivo:** `src/backend/chat_llm.py`
- **Funções Implementadas:**
  - `chat_with_llm()`: Envia prompts ao modelo e retorna a resposta.
  - `helper()`: Função auxiliar para interação do usuário.
  - `list_generator()`: Geração automática de listas baseadas em prompts.

## Testes Automatizados com Pytest

### **Testes de Avaliação e Análise**
- **Arquivo:** `src/backend/tests/analyze_ragas.py`
- **Objetivo:** Carregar os resultados e gerar gráficos de avaliação.
- **Destaques:**
  - Geração de histogramas de `context_recall` e outras métricas.

### **Testes Unitários e de Integração**
- **Arquivos:**
  - `src/backend/tests/test_generation.py`
  - `src/backend/tests/test_integration.py`
  - `src/backend/tests/test_retrieval.py`
- **Objetivo:** Garantir o funcionamento correto dos componentes da API.
- **Métodos Utilizados:**
  - Uso de `MagicMock` para simular interações com o LLM e o banco vetorial.
  - Testes de recuperação de documentos e geração de respostas.

## Dependências
- **Arquivo:** `src/backend/tests/requirements-tests.txt`
- **Principais Bibliotecas:**
  - `pytest`, `pytest-mock`, `pytest-cov`
  - `requests`, `PyYAML`
  - `flask-testing` e `httpx` para testes de API

## Resultados

### Distribuição do Context Recall
A métrica Context Recall mede a capacidade do modelo de recuperar informações relevantes dentro do conjunto de documentos disponíveis. O gráfico abaixo apresenta a distribuição dos valores obtidos:

![Gráfico de Context Recall](/img/context-recall.png)
*Figura 01: histograma que exibe a distribuição dos valores de Context Recall em um experimento.*

Os resultados indicam que a maioria das pontuações de Context Recall se concentra entre 0.7 e 0.9, sugerindo uma boa recuperação de informações.

### Correlação entre Faithfulness e Relevance
Para avaliar a precisão e relevância das respostas geradas, analisamos a relação entre Faithfulness (fidelidade ao documento recuperado) e Relevance (relevância da resposta gerada). O gráfico a seguir ilustra essa correlação:

![Gráfico de Faithfulness vs. Relevance](/img/faith-relev.png)
*Figura 02: gráfico de dispersão que analisa a relação entre Faithfulness (Fidelidade) e Relevance (Relevância) em um experimento.*

Observamos que as respostas com alta fidelidade também tendem a ser mais relevantes, o que sugere que o modelo está utilizando adequadamente os documentos recuperados para gerar respostas consistentes.

### Considerações sobre o Desempenho
Os resultados dos testes e métricas demonstram que o pipeline de RAG está operando corretamente e apresentando uma boa recuperação e geração de respostas. Entretanto, variações na pontuação das métricas sugerem oportunidades de otimização, como ajustes nos hiperparâmetros da recuperação de documentos ou na engenharia de prompts.

---

## Referências de Código
- **Implementação Principal:** src/backend/llms/llm_provider.py
- **Configuração:** src/backend/config/llm_config.yaml
- **Classes e Funções:**
  - LLMProvider: src/backend/llms/llm_provider.py:1-5
  - OllamaProvider: src/backend/llms/llm_provider.py:7-89
  - OpenAIProvider: src/backend/llms/llm_provider.py:91-134
  - DeepSeekProvider: src/backend/llms/llm_provider.py:136-180
  - get_llm_provider(): src/backend/llms/llm_provider.py:182-196
  - load_llm_config(): src/backend/llms/llm_provider.py:202-237
  - get_provider(): src/backend/llms/llm_provider.py:239-284

### Testes Automatizados
Para garantir a integridade do pipeline de RAG, realizamos testes unitários e de integração utilizando pytest. Os seguintes testes foram executados com sucesso:
- **Testes de Integração:** Validação do fluxo completo do pipeline de RAG.
- **Testes de Recuperação:** Avaliação da eficácia do mecanismo de busca.
- **Testes de Geração:** Verificação da coerência e fidelidade das respostas.

Os resultados indicaram que todas as funções essenciais do pipeline estão operando corretamente, sem falhas.
