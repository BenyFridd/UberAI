import { MARKET_DATA, MarketData } from "../data/marketData"

interface Product {
  categoria: string
  marca: string
  nome: string
  similaridade: number
  valor: string | number
  descricao: string
}

interface MarketProducts {
  [key: string]: Product[]
}

interface Market {
  nome_mercado: string
  itens: MarketProducts
}

interface ApiResponse {
  message: Market[] | string;
  isMarketData?: boolean;
}

// Backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function searchProducts(message: string): Promise<ApiResponse> {
  try {
    // Make a real API call to the backend
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if the response is a markets array or a text message
    if (data.message && Array.isArray(data.message) && data.message.length > 0 && data.message[0].nome_mercado) {
      // Log formatted product data for debugging
      console.log("API Response - Product Data:");
      console.log(JSON.stringify(data, null, 2));
      
      // Count products per market
      const marketStats = data.message.map((market: Market) => {
        const totalProducts = Object.values(market.itens)
          .reduce((acc: number, products: Product[]) => acc + products.length, 0);
        
        return {
          market: market.nome_mercado,
          categories: Object.keys(market.itens).length,
          products: totalProducts
        };
      });
      
      console.log("Market Statistics:");
      console.table(marketStats);
      
      return {
        message: data.message,
        isMarketData: true
      };
    } else {
      // Log text message response
      console.log("API Response - Text Message:");
      console.log(data.message);
      
      // If it's a string message or any other format
      return {
        message: data.message || "Não foi possível obter uma resposta válida",
        isMarketData: false
      };
    }
  } catch (error) {
    console.error("Error details:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to fetch products: ${error.message}`)
    }
    throw new Error("An unknown error occurred while fetching products")
  }
}

