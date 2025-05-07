"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { ProductModal } from "./ProductModal"
import { useRouter } from "expo-router"

interface Product {
  categoria: string
  marca: string
  nome: string
  similaridade: number
  valor: string | number
  descricao: string
}

interface Market {
  nome_mercado: string
  itens: {
    [key: string]: Product[]
  }
}

interface MarketProductDisplayProps {
  data?: Market[]
  searchTerm?: string
}

export const MarketProductDisplay: React.FC<MarketProductDisplayProps> = ({
  data = [],
  searchTerm = "",
}) => {
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedMarket(data[0].nome_mercado)
    }
  }, [data])

  useEffect(() => {
    if (selectedMarket && data) {
      const marketData = data.find(market => market.nome_mercado === selectedMarket)
      if (marketData) {
        // Flatten all product arrays from all categories
        const allProducts = Object.values(marketData.itens)
          .flat()
          .filter(
            (product) =>
              searchTerm === "" ||
              product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        setFilteredProducts(allProducts)
      } else {
        setFilteredProducts([])
      }
    } else {
      setFilteredProducts([])
    }
  }, [selectedMarket, searchTerm, data])

  // Calculate total items for each market
  const getMarketItemCount = (marketName: string) => {
    if (!data) return 0;
    const marketData = data.find(market => market.nome_mercado === marketName)
    if (!marketData) return 0;
    
    // Count the number of categories (like hamburguer, pão, queijo) instead of all products
    return Object.keys(marketData.itens).length;
  };

  const handleMarketPress = (marketName: string) => {
    setSelectedMarket(marketName);
    
    // Store the data globally so it can be accessed in the market-items page
    if (typeof global !== 'undefined') {
      (global as any).marketData = data;
    }
    
    // Navigate to the market-items page with the market name as a parameter
    router.push({
      pathname: "/market-items",
      params: { marketName }
    });
  };

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum produto disponível</Text>
      </View>
    )
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        {/* Market Selection */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.marketButtonsContainer}
        >
          {data.map((market) => (
            <TouchableOpacity
              key={market.nome_mercado}
              style={[styles.marketCard, selectedMarket === market.nome_mercado && styles.selectedMarketCard]}
              onPress={() => handleMarketPress(market.nome_mercado)}
            >
              <View style={styles.marketImage}>
                <Ionicons 
                  name="storefront-outline" 
                  size={40} 
                  color={selectedMarket === market.nome_mercado ? "#fff" : "#666"} 
                />
              </View>
              <Text 
                style={[styles.marketName, selectedMarket === market.nome_mercado && styles.selectedMarketName]} 
                numberOfLines={2} 
                ellipsizeMode="tail"
              >
                {market.nome_mercado}
              </Text>
              <Text 
                style={[styles.marketItemCount, selectedMarket === market.nome_mercado && styles.selectedMarketItemCount]}
              >
                {getMarketItemCount(market.nome_mercado)} itens
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products
        {filteredProducts.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          >
            {filteredProducts.map((product, index) => (
              <TouchableOpacity
                key={index}
                style={styles.productCard}
                onPress={() => {
                  setSelectedProduct(product)
                  setIsModalVisible(true)
                }}
              >
                <View style={styles.productImage}>
                  <Ionicons name="nutrition-outline" size={40} color="#666" />
                </View>
                <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
                  {product.nome}
                </Text>
                <Text style={styles.productPrice}>{product.valor}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
          </View>
        )} */}
      </View>

      {/* <ProductModal
        product={selectedProduct}
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false)
          setSelectedProduct(null)
        }}
      /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  innerContainer: {
    padding: 10,
  },
  marketButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  marketCard: {
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedMarketCard: {
    backgroundColor: "#06C167",
  },
  marketImage: {
    width: "100%",
    height: 100,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  marketName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#000",
  },
  selectedMarketName: {
    color: "#fff",
  },
  marketItemCount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#06C167",
  },
  selectedMarketItemCount: {
    color: "#fff",
  },
  productsContainer: {
    paddingHorizontal: 10,
  },
  productCard: {
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: "100%",
    height: 100,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#000",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#06C167",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
})

