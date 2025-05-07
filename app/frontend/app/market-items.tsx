import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MARKET_DATA } from '../data/marketData';

// Define the Market and Product interfaces
interface Product {
  categoria: string;
  marca: string;
  nome: string;
  similaridade: number;
  valor: string | number;
  descricao: string;
}

interface Market {
  nome_mercado: string;
  itens: {
    [key: string]: Product[];
  };
}

export default function MarketItemsScreen() {
  const params = useLocalSearchParams();
  const marketName = params.marketName as string;
  const router = useRouter();
  const navigation = useNavigation();
  const [items, setItems] = useState<string[]>([]);

  // Add navigation title
  useEffect(() => {
    if (marketName) {
      navigation.setOptions?.({
        title: marketName
      });
    }
  }, [marketName, navigation]);

  useEffect(() => {
    if (marketName) {
      // Try to get the market data from the previous screen's state if available
      const marketData = typeof global !== 'undefined' && (global as any).marketData ? 
        (global as any).marketData.find((m: Market) => m.nome_mercado === marketName) : 
        undefined;
      
      if (marketData) {
        // Get categories from the API response
        const itemNames = Object.keys(marketData.itens);
        setItems(itemNames);
      } else {
        // Fallback to mock data if API data is not available
        const market = MARKET_DATA.find(m => m.nome_mercado === marketName);
        if (market) {
          const itemNames = Object.keys(market.itens);
          setItems(itemNames);
        }
      }
    }
  }, [marketName]);

  const renderItem = ({ item }: { item: string }) => {
    // Try to get real market data first
    let itemCount = 0;
    
    // Use type assertion to avoid TypeScript errors with the global object
    const marketData = typeof global !== 'undefined' && (global as any).marketData ? 
      (global as any).marketData.find((m: Market) => m.nome_mercado === marketName) : 
      undefined;
    
    if (marketData && marketData.itens[item]) {
      itemCount = marketData.itens[item].length;
    } else {
      // Fallback to mock data
      const market = MARKET_DATA.find(m => m.nome_mercado === marketName);
      itemCount = market?.itens[item as keyof typeof market.itens]?.length || 0;
    }
    
    return (
      <TouchableOpacity 
        style={styles.itemCard}
        onPress={() => {
          // Navigate to the market-item-products page with the market name and item name as parameters
          router.push({
            pathname: "/market-item-products",
            params: { marketName, itemName: item }
          });
        }}
      >
        <View style={styles.itemIconContainer}>
          <Ionicons name="nutrition-outline" size={24} color="#06C167" />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item}</Text>
          <Text style={styles.itemCount}>
            {itemCount} produtos
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{marketName}</Text>
      </View>
      
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum item encontrado</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 50,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f9f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
}); 