<table>
<tr>
<td>
<a href= "https://www.inteli.edu.br/"><img src="img\inteli-logo.png" alt="Inteli - Instituto de Tecnologia e Liderança" border="0" width="30%"></a>
<a href= "https://www.uber.com/br/pt-br/"><img src="img\logo-uber.png" alt="Minipa" border ="0" width="30%"></a>
</td>
</tr>
</table>

---

# Projeto: SmartShop – Listas de Compras Personalizadas com IA Generativa no Uber Grocery

# Grupo 02

# Integrantes

- [Beny Fridd](https://www.linkedin.com/in/beny-frid/)
- [Enya Oliveira](https://www.linkedin.com/in/enya-oliveira/)
- [Marcos Teixeira](https://www.linkedin.com/in/marcos-teixeira-37676a24a/)
- [Guilherme Novaes](https://www.linkedin.com/in/guilherme-novaes-lima/) 
- [Fábio Piemonte](https://www.linkedin.com/in/fabio-piemonte-823a65211/) 

# Descrição

Este projeto tem como objetivo desenvolver um sistema backend inteligente que utiliza IA generativa para processar listas de compras personalizadas. O sistema irá interpretar descrições em linguagem natural, mapear os itens com os catálogos dos mercados parceiros e sugerir substituições para itens indisponíveis, armazenando as preferências dos usuários para futuras compras.

## Objetivo

- **Processamento de Listas:** Interpretar listas de compras em texto, com diferentes níveis de especificidade (ex.: "manteiga de amendoim orgânica, sem açúcar, da marca X" ou "manteiga de amendoim").
- **Mapeamento de Produtos:** Verificar quais mercados parceiros possuem os itens solicitados e identificar os itens disponíveis e os ausentes.
- **Sugestões de Substituição:** Propor alternativas para itens que não estejam disponíveis.
- **Armazenamento de Preferências:** Registrar as escolhas dos usuários para melhorar a experiência em compras futuras.

# Configurações para desenvolvimento

## Instalação

### Backend

1. Instale o [UV](https://github.com/astral-sh/uv) (se ainda não tiver):
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. Clone este repositório e acesse a pasta:
```bash
git clone <repository-url>
cd app
```

3. Instale as dependências:
```bash
uv add -r requirements.txt
```

4. Crie um arquivo .env na raiz do projeto com sua chave da API da OpenAI:
```
OPENAI_API_KEY=your_api_key_here
```

5. Execute a API:
```bash
uv run api.py
```

### Frontend

1. Instale o Node.js e npm (se ainda não tiver): [nodejs.org](https://nodejs.org/)

2. Instale o Expo CLI:
```bash
npm install -g expo-cli
```

3. Configure o ambiente de desenvolvimento para React Native seguindo a [documentação oficial do Expo](https://docs.expo.dev/get-started/installation/)

4. Acesse a pasta do frontend:
```bash
cd frontend
```

5. Instale as dependências:
```bash
npm install
```

6. Execute o aplicativo:
```bash
npx expo run
```

7. Para desenvolvimento com emulador, siga as instruções para [configurar um emulador Android](https://docs.expo.dev/workflow/android-studio-emulator/) ou [iOS](https://docs.expo.dev/workflow/ios-simulator/) conforme a documentação do Expo.

# Tags

## Sprint 01
- Pipeline de Processamento e Base de Dados
- Draft do Artigo
- Apresentação da SPRINT 1

## Sprint 02
- Implementação de Modelos de Embeddings
- Artigo com Avaliação de Embeddings
- Apresentação da SPRINT 2

## Sprint 03
- Implementação de Modelo LLM ou BERT
- Artigo com Avaliação de Modelo LLM ou BERT
- Apresentação da SPRINT 3

## Sprint 04
- Implementação de Classificadores para Mapeamento de Produtos
- Artigo com a Implementação e Avaliação da Classificação de Produtos
- Apresentação da SPRINT 4

## Sprint 05
- Implementação Final
- Implementação de Desafio
- Artigo Final
- Apresentação Final

---

Este README apresenta os pontos essenciais do projeto e serve como referência inicial para o desenvolvimento do sistema.

<br><br>
![Licença](img/licenca.png)
<br>
<a href="https://creativecommons.org/licenses/by/4.0/?ref=chooser-v1">Attribution 4.0 International<a>