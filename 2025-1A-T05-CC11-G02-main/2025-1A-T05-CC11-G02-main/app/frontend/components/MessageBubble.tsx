import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { AudioPlayer } from "./AudioPlayer"
import { MessageActions } from "./MessageActions"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

interface MessageBubbleProps {
  isAI: boolean
  text: string
  image?: string
  audioUri?: string
  reactions?: {
    likes: number
    dislikes: number
    userReaction?: "like" | "dislike"
  }
  onReact: (type: "like" | "dislike") => void
  onEdit?: () => void
  onDelete?: () => void
}

export function MessageBubble({
  isAI,
  text,
  image,
  audioUri,
  reactions,
  onReact,
  onEdit,
  onDelete,
}: MessageBubbleProps) {
  const hasContent = text || image || audioUri

  if (!hasContent) {
    return null
  }

  return (
    <View style={[styles.container, isAI ? styles.aiContainer : styles.userContainer]}>
      {isAI && (
        <View style={styles.aiIcon}>
          <Image source={require("@/assets/images/ailogo2.jpg")} style={styles.aiIconImage} />
        </View>
      )}
      <View style={[styles.bubble, isAI ? styles.aiBubble : styles.userBubble]}>
        {image && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
              onError={(e) => console.log("Image loading error:", e.nativeEvent.error)}
            />
          </View>
        )}
        {audioUri && <AudioPlayer uri={audioUri} />}
        {text && <Text style={[styles.text, isAI ? styles.aiText : styles.userText]}>{text}</Text>}
        {isAI && reactions && (
          <View style={styles.reactions}>
            <TouchableOpacity style={[styles.reactionButton]} onPress={() => onReact("like")}>
              <Ionicons
                name={reactions.userReaction === "like" ? "thumbs-up" : "thumbs-up-outline"}
                size={16}
                color={reactions.userReaction === "like" ? "#06C167" : "#666"}
              />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.reactionButton]} onPress={() => onReact("dislike")}>
              <Ionicons
                name={reactions.userReaction === "dislike" ? "thumbs-down" : "thumbs-down-outline"}
                size={16}
                color={reactions.userReaction === "dislike" ? "#666" : "#666"}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {!isAI && <MessageActions onEdit={onEdit} onDelete={onDelete} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  aiContainer: {
    marginRight: 48,
  },
  userContainer: {
    marginLeft: 48,
    justifyContent: "flex-end",
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: "80%",
  },
  aiBubble: {
    backgroundColor: "#f8f8f8",
    marginLeft: 12,
  },
  userBubble: {
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  aiText: {
    color: "#000",
  },
  userText: {
    color: "#fff",
  },
  image: {
    width: "100%",
    maxWidth: 200,
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 8,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#06C167",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  aiIconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  reactions: {
    flexDirection: "row",
    marginTop: 8,
    gap: 16,
  },
  reactionButton: {
    padding: 4,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    marginBottom: 8,
  },
})

