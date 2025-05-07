import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface Suggestion {
  text: string
  icon: string
  title: string
  subtitle: string
}

interface SuggestionsProps {
  suggestions: Suggestion[]
  onSuggestionPress: (text: string) => void
}

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.4, 160) // Responsive width with max size

export function Suggestions({ suggestions, onSuggestionPress }: SuggestionsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {suggestions.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.card, { width: CARD_WIDTH }]}
          onPress={() => onSuggestionPress(item.text)}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={item.icon as any} size={20} color="#06C167" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {item.subtitle}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 12,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: "#666",
  },
})

