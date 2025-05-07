"use client"

import { useState } from "react"
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

// Define Product interface locally to match our API
interface Product {
  categoria: string;
  marca: string;
  nome: string;
  similaridade: number;
  valor: string | number;
  descricao: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const isSmallDevice = SCREEN_HEIGHT < 700

interface ProductModalProps {
  product: Product | null
  isVisible: boolean
  onClose: () => void
}

export function ProductModal({ product, isVisible, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  // Get appropriate icon based on category
  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase()
    if (lowerCategory.includes("chocolate") || lowerCategory.includes("doces")) return "nutrition"
    if (lowerCategory.includes("leite")) return "water"
    if (lowerCategory.includes("sabonete")) return "flower"
    return "nutrition"
  }

  // Clean HTML from description and use product info if no description
  const getDescription = (product: Product) => {
    if (product.descricao) {
      return product.descricao.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")
    }
    const categories = product.categoria.split("|")
    return `${product.nome} - ${categories[0]}. A quality product from ${product.marca}.`
  }

  const mainCategory = product.categoria.split("|")[0]
  const productIcon = getCategoryIcon(mainCategory)

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <View style={styles.iconGradient}>
              <Ionicons name={productIcon} size={48} color="#06C167" />
            </View>
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.title} numberOfLines={2}>
              {product.nome}
            </Text>
            <Text style={styles.price}>{product.valor}</Text>
          </View>

          <TouchableOpacity style={styles.marketInfo}>
            <View style={styles.marketIconContainer}>
              <View style={styles.marketIcon}>
                <Ionicons name="storefront" size={20} color="#fff" />
              </View>
            </View>
            <View style={styles.marketDetails}>
              <Text style={styles.marketName}>{product.marca}</Text>
              <Text style={styles.deliveryInfo}>
                <Ionicons name="time-outline" size={14} color="#666" /> £0 Delivery Fee • 30-40 min
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <View style={styles.quantityContainer}>
            <View style={styles.quantitySelector}>
              <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Replacement preference</Text>
            <TouchableOpacity style={styles.replacementButton}>
              <View style={styles.replacementIconContainer}>
                <Ionicons name="git-compare" size={20} color="#06C167" />
              </View>
              <Text style={styles.replacementText}>Best match</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{getDescription(product)}</Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add to cart</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerButton: {
    padding: 12,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productInfo: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    color: "#000",
    letterSpacing: -0.5,
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  marketInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  marketIconContainer: {
    marginRight: 12,
  },
  marketIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#06C167",
    alignItems: "center",
    justifyContent: "center",
  },
  marketDetails: {
    flex: 1,
  },
  marketName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 2,
  },
  deliveryInfo: {
    fontSize: 13,
    color: "#666",
  },
  quantityContainer: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  quantityButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontSize: 24,
    color: "#000",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "400",
    marginHorizontal: 24,
    color: "#000",
  },
  section: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  replacementButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 8,
  },
  replacementIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  replacementText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#666",
  },
  footer: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

