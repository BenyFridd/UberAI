import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MARKET_DATA } from '../data/marketData';
import { ProductModal } from '../components/ProductModal';

// Define Product interface locally to match our API
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

const windowWidth = Dimensions.get('window').width;
const cardWidth = (windowWidth - (16 * 3)) / 2; // 16 is the padding/margin we'll use

export default function MarketItemProductsScreen() {
  const params = useLocalSearchParams();
  const marketName = params.marketName as string;
  const itemName = params.itemName as string;
  const router = useRouter();
  const navigation = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Set navigation title
  useEffect(() => {
    if (itemName) {
      navigation.setOptions?.({
        title: itemName
      });
    }
  }, [itemName, navigation]);

  useEffect(() => {
    if (marketName && itemName) {
      // Try to get the market data from the global state if available
      if (typeof global !== 'undefined' && (global as any).marketData) {
        const marketData = (global as any).marketData.find((m: Market) => m.nome_mercado === marketName);
        if (marketData && marketData.itens[itemName]) {
          setProducts(marketData.itens[itemName]);
          return;
        }
      }

      // Fallback to mock data if API data is not available
      const market = MARKET_DATA.find(m => m.nome_mercado === marketName);
      if (market && itemName in market.itens) {
        setProducts(market.itens[itemName as keyof typeof market.itens]);
      }
    }
  }, [marketName, itemName]);

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.productImage}>
        <Ionicons name="nutrition-outline" size={40} color="#666" />
      </View>
      <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
        {item.nome}
      </Text>
      <Text style={styles.productPrice}>{item.valor}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{itemName}</Text>
      </View>
      
      {products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.productsContainer}
          columnWrapperStyle={styles.row}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
        </View>
      )}

      <ProductModal
        product={selectedProduct}
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedProduct(null);
        }}
      />
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
  productsContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: cardWidth, // Make it square
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#000',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#06C167',
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