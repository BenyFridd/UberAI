export const MARKET_DATA = [
    {
      nome_mercado: "Mercado do Inteli",
      itens: {
        açúcar: [
          {
            categoria: "Alimentos|Doces e sobremesas|Bomboniere|Chocolate",
            descricao: "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
            marca: "Bauducco",
            nome: "Bolo de Páscoa Cobertura Confeitos Açucarados Bauducco Colomba Caixa 400g",
            similaridade: 0.8279384810303848,
            valor: "R$ 19.99",
          },
        ],
        "farinha de trigo": [],
        "fermento em pó": [],
        leite: [
          {
            categoria: "Creme de leite|Enlatados e conservas|Enlatados e conservas|Alimentos",
            descricao: "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
            marca: "QUALITÁ",
            nome: "Creme de Leite UHT Qualitá Caixa 200g",
            similaridade: 0.8204814746548131,
            valor: "R$ 4.39",
          },
        ],
        ovos: [],
      },
    },
    {
      nome_mercado: "Mercado Preço Justo",
      itens: {
        açúcar: [
          {
            categoria: "Alimentos|Doces e sobremesas|Bomboniere|Chocolate",
            descricao: "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
            marca: "Bauducco",
            nome: "Bolo de Páscoa Cobertura Confeitos Açucarados Bauducco Colomba Caixa 400g",
            similaridade: 0.8279384810303848,
            valor: "R$ 19.99",
          },
        ],
        "farinha de trigo": [],
        "fermento em pó": [],
        leite: [
          {
            categoria: "Creme de leite|Enlatados e conservas|Enlatados e conservas|Alimentos",
            descricao: "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
            marca: "QUALITÁ",
            nome: "Creme de Leite UHT Qualitá Caixa 200g",
            similaridade: 0.8204814746548131,
            valor: "R$ 4.39",
          },
        ],
        ovos: [],
      },
    },
    {
      nome_mercado: "Super Econômico Uberlândia",
      itens: {
        açúcar: [
          {
            categoria: "Alimentos|Doces e sobremesas|Bomboniere|Chocolate",
            descricao: "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
            marca: "Bauducco",
            nome: "Bolo de Páscoa Cobertura Confeitos Açucarados Bauducco Colomba Caixa 400g",
            similaridade: 0.8279384810303848,
            valor: "R$ 19.99",
          },
        ],
        "farinha de trigo": [],
        "fermento em pó": [],
        leite: [
          {
            categoria: "Creme de leite|Enlatados e conservas|Enlatados e conservas|Alimentos",
            descricao: "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
            marca: "QUALITÁ",
            nome: "Creme de Leite UHT Qualitá Caixa 200g",
            similaridade: 0.8204814746548131,
            valor: "R$ 4.39",
          },
        ],
        ovos: [],
      },
    },
  ]
  
  export interface Product {
    categoria: string
    descricao: string
    marca: string
    nome: string
    similaridade: number
    valor: string
  }
  
  export interface Market {
    nome_mercado: string
    itens: {
      [key: string]: Product[]
    }
  }
  
  export type MarketData = Market[]
  
  