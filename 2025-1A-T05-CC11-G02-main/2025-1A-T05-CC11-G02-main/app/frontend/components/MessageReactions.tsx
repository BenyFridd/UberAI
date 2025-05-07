import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MessageReactionsProps {
  reactions: { likes: number; dislikes: number } | undefined;
  onReact: (type: 'like' | 'dislike') => void;
}

export const MessageReactions: React.FC<MessageReactionsProps> = ({ reactions, onReact }) => (
  <View style={styles.reactions}>
    <TouchableOpacity 
      style={styles.reactionButton} 
      onPress={() => onReact('like')}
    >
      <Ionicons name="thumbs-up-outline" size={16} color="#06C167" />
      {reactions && reactions.likes > 0 && (
        <Text style={styles.reactionCount}>{reactions.likes}</Text>
      )}
    </TouchableOpacity>
    <TouchableOpacity 
      style={styles.reactionButton} 
      onPress={() => onReact('dislike')}
    >
      <Ionicons name="thumbs-down-outline" size={16} color="#666" />
      {reactions && reactions.dislikes > 0 && (
        <Text style={styles.reactionCount}>{reactions.dislikes}</Text>
      )}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  reactions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    marginLeft: 4,
  },
  reactionCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
});