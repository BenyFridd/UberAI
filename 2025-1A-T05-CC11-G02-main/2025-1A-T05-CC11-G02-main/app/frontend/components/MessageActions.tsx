import { View, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface MessageActionsProps {
  onEdit?: () => void
  onDelete?: () => void
}

export function MessageActions({ onEdit, onDelete }: MessageActionsProps) {
  return (
    <View style={styles.actionsContainer}>
      {onEdit && (
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <Ionicons name="pencil-outline" size={20} color="#666" />
        </TouchableOpacity>
      )}
      {onDelete && (
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  actionButton: {
    padding: 5,
  },
})

