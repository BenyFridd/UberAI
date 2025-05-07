"use client"

import { useState, useRef } from "react"
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { Header } from "../../components/Header"
import { MessageBubble } from "../../components/MessageBubble"
import { Suggestions } from "../../components/Suggestions"
import { TypingIndicator } from "../../components/TypingIndicator"
import { VoiceRecorder } from "../../components/VoiceRecorder"
import { MarketProductDisplay } from "../../components/MarketProductDisplay"
import { searchProducts } from "../../services/api"
import { Alert } from "react-native"
import React from "react"

interface Market {
  nome_mercado: string
  itens: {
    [key: string]: {
      categoria: string
      marca: string
      nome: string
      similaridade: number
      valor: string | number
      descricao: string
    }[]
  }
}

interface ApiResponse {
  message: Market[]
}

interface Message {
  id: string
  text: string
  isAI: boolean
  timestamp: Date
  image?: string
  audioUri?: string
  showMarketDisplay?: boolean
  showMarketAfter?: boolean
  marketData?: Market[]
  reactions?: {
    likes: number
    dislikes: number
    userReaction?: "like" | "dislike"
  }
  aiResponseId?: string
}

const SUGGESTIONS = [
  {
    text: "Procurar leite e pão",
    icon: "cart",
    title: "Básicos",
    subtitle: "Itens essenciais",
  },
  {
    text: "Encontrar ofertas de frutas",
    icon: "nutrition",
    title: "Frutas",
    subtitle: "Melhores preços",
  },
  {
    text: "Buscar produtos de limpeza",
    icon: "water",
    title: "Limpeza",
    subtitle: "Produtos domésticos",
  },
  {
    text: "Ver produtos em promoção",
    icon: "pricetag",
    title: "Promoções",
    subtitle: "Ofertas do dia",
  },
]

export default function ExplorePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Sou seu assistente de compras.",
      isAI: true,
      timestamp: new Date(),
      reactions: { likes: 0, dislikes: 0 },
    },
    {
      id: "2",
      text: "Digite os produtos que você procura ou escolha uma das sugestões abaixo.",
      isAI: true,
      timestamp: new Date(),
      reactions: { likes: 0, dislikes: 0 },
    },
  ])
  const [inputText, setInputText] = useState<string>("")
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showImageOptions, setShowImageOptions] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const flatListRef = useRef<FlatList<Message>>(null)
  const scrollY = useRef(new Animated.Value(0)).current

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [Platform.OS === "ios" ? 80 : 50, Platform.OS === "ios" ? 60 : 40],
    extrapolate: "clamp",
  })

  const fontSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [28, 20],
    extrapolate: "clamp",
  })

  const handleSend = async () => {
    if (inputText.trim() && !isTyping) {
      const messageId = String(Date.now())

      const newMessage: Message = {
        id: messageId,
        text: inputText,
        isAI: false,
        timestamp: new Date(),
      }

      setMessages([...messages, newMessage])
      setInputText("")
      setIsTyping(true)

      try {
        const response = await searchProducts(inputText)

        setIsTyping(false)
        if (response && response.message) {
          if (response.isMarketData) {
            setMessages((prev) => [
              ...prev,
              {
                id: String(Date.now()),
                text: "Aqui estão os produtos que encontrei para você:",
                isAI: true,
                timestamp: new Date(),
                reactions: { likes: 0, dislikes: 0 },
                showMarketAfter: true,
                marketData: response.message as Market[],
              },
            ])
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: String(Date.now()),
                text: response.message as string,
                isAI: true,
                timestamp: new Date(),
                reactions: { likes: 0, dislikes: 0 },
              },
            ])
          }
        }

        flatListRef.current?.scrollToEnd({ animated: true })
      } catch (error) {
        console.error("Error in handleSend:", error)
        setIsTyping(false)

        const errorMessage = Platform.select({
          android: "Erro ao conectar com o servidor. Verifique se o servidor está rodando e acessível.",
          ios: "Erro ao buscar produtos. Por favor, tente novamente.",
          default: "Erro ao processar sua solicitação. Por favor, tente novamente.",
        })

        Alert.alert("Erro", errorMessage, [{ text: "OK" }])

        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            text: "Desculpe, encontrei um erro ao buscar os produtos. Por favor, verifique sua conexão e tente novamente.",
            isAI: true,
            timestamp: new Date(),
            reactions: { likes: 0, dislikes: 0 },
          },
        ])
      }
    }
  }

  const handleSuggestionPress = async (suggestion: string) => {
    const messageId = String(Date.now())

    const newMessage: Message = {
      id: messageId,
      text: suggestion,
      isAI: false,
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setIsTyping(true)

    try {
      const response = await searchProducts(suggestion)

      setIsTyping(false)
      if (response && response.message) {
        if (response.isMarketData) {
          setMessages((prev) => [
            ...prev,
            {
              id: String(Date.now()),
              text: "Aqui estão os produtos que encontrei para você:",
              isAI: true,
              timestamp: new Date(),
              reactions: { likes: 0, dislikes: 0 },
              showMarketAfter: true,
              marketData: response.message as Market[],
            },
          ])
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: String(Date.now()),
              text: response.message as string,
              isAI: true,
              timestamp: new Date(),
              reactions: { likes: 0, dislikes: 0 },
            },
          ])
        }
      }

      flatListRef.current?.scrollToEnd({ animated: true })
    } catch (error) {
      console.error("Error:", error)
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          text: "Desculpe, encontrei um erro ao buscar os produtos. Por favor, tente novamente.",
          isAI: true,
          timestamp: new Date(),
          reactions: { likes: 0, dislikes: 0 },
        },
      ])
    }
  }

  const renderMessage = ({ item }: { item: Message }) => {
    return (
      <View>
        <MessageBubble
          isAI={item.isAI}
          text={item.text}
          image={item.image}
          audioUri={item.audioUri}
          reactions={item.reactions}
          onReact={(type) => handleReaction(item.id, type)}
          onEdit={() => handleEdit(item)}
          onDelete={() => handleDelete(item.id)}
        />
        {item.isAI && item.showMarketAfter && item.marketData && Array.isArray(item.marketData) && item.marketData.length > 0 && (
          <View style={styles.marketDisplayContainer}>
            <MarketProductDisplay data={item.marketData} searchTerm="" />
          </View>
        )}
      </View>
    )
  }

  const handleEdit = (message: Message) => {
    setEditingMessage(message)
    setShowEditModal(true)
  }

  const handleDelete = (messageId: string) => {
    Alert.alert("Deletar Mensagem", "Tem certeza que deseja deletar esta mensagem?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: () => {
          const deletedMessageIndex = messages.findIndex((m) => m.id === messageId)
          if (deletedMessageIndex !== -1) {
            const updatedMessages = messages.slice(0, deletedMessageIndex)
            setMessages(updatedMessages)

            if (deletedMessageIndex < messages.length - 1) {
              setIsTyping(true)
              setTimeout(() => {
                setIsTyping(false)
                setMessages((prev) => [
                  ...prev,
                  {
                    id: String(Date.now()),
                    text: "Notei que você deletou uma mensagem. Como posso ajudar?",
                    isAI: true,
                    timestamp: new Date(),
                    reactions: { likes: 0, dislikes: 0 },
                  },
                ])
                flatListRef.current?.scrollToEnd({ animated: true })
              }, 2000)
            }
          }
        },
      },
    ])
  }

  const handleReaction = (messageId: string, type: "like" | "dislike") => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId && msg.reactions) {
          if (msg.reactions.userReaction === type) {
            return {
              ...msg,
              reactions: {
                ...msg.reactions,
                [type === "like" ? "likes" : "dislikes"]: msg.reactions[type === "like" ? "likes" : "dislikes"] - 1,
                userReaction: undefined,
              },
            }
          }
          const oldReaction = msg.reactions.userReaction
          return {
            ...msg,
            reactions: {
              likes: msg.reactions.likes + (type === "like" ? 1 : 0) - (oldReaction === "like" ? 1 : 0),
              dislikes: msg.reactions.dislikes + (type === "dislike" ? 1 : 0) - (oldReaction === "dislike" ? 1 : 0),
              userReaction: type,
            },
          }
        }
        return msg
      }),
    )
  }

  const saveEdit = async (newText: string) => {
    if (editingMessage && newText.trim()) {
      const editedMessageIndex = messages.findIndex((m) => m.id === editingMessage.id)
      if (editedMessageIndex !== -1) {
        const updatedMessages = messages.slice(0, editedMessageIndex + 1)
        updatedMessages[editedMessageIndex] = {
          ...editingMessage,
          text: newText,
        }

        setMessages(updatedMessages)
        setShowEditModal(false)
        setEditingMessage(null)
        setIsTyping(true)

        try {
          const response = await searchProducts(newText)

          setIsTyping(false)
          if (response && response.message) {
            if (response.isMarketData) {
              setMessages((prev) => [
                ...prev,
                {
                  id: String(Date.now()),
                  text: "Aqui estão os produtos que encontrei para você:",
                  isAI: true,
                  timestamp: new Date(),
                  reactions: { likes: 0, dislikes: 0 },
                  showMarketAfter: true,
                  marketData: response.message as Market[],
                },
              ])
            } else {
              setMessages((prev) => [
                ...prev,
                {
                  id: String(Date.now()),
                  text: response.message as string,
                  isAI: true,
                  timestamp: new Date(),
                  reactions: { likes: 0, dislikes: 0 },
                },
              ])
            }
          }

          flatListRef.current?.scrollToEnd({ animated: true })
        } catch (error) {
          console.error("Error:", error)
          setIsTyping(false)
          setMessages((prev) => [
            ...prev,
            {
              id: String(Date.now()),
              text: "Desculpe, encontrei um erro ao buscar os produtos. Por favor, tente novamente.",
              isAI: true,
              timestamp: new Date(),
              reactions: { likes: 0, dislikes: 0 },
            },
          ])
        }
      }
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      const newMessage: Message = {
        id: String(Date.now()),
        text: "",
        isAI: false,
        timestamp: new Date(),
        image: result.assets[0].uri,
      }
      setMessages([...messages, newMessage])
      flatListRef.current?.scrollToEnd({ animated: true })

      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            text: "Boa foto! Como posso ajudar?",
            isAI: true,
            timestamp: new Date(),
            reactions: { likes: 0, dislikes: 0 },
          },
        ])
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 2000)
    }
  }

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      const newMessage: Message = {
        id: String(Date.now()),
        text: "",
        isAI: false,
        timestamp: new Date(),
        image: result.assets[0].uri,
      }
      setMessages([...messages, newMessage])
      flatListRef.current?.scrollToEnd({ animated: true })

      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            text: "Ótima foto! Como posso ajudar?",
            isAI: true,
            timestamp: new Date(),
            reactions: { likes: 0, dislikes: 0 },
          },
        ])
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 2000)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header headerHeight={headerHeight} fontSize={fontSize} />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        ListFooterComponent={
          <>
            {messages.length <= 2 && (
              <View style={styles.suggestionsContainer}>
                <Suggestions suggestions={SUGGESTIONS} onSuggestionPress={handleSuggestionPress} />
              </View>
            )}
            {isTyping && <TypingIndicator />}
          </>
        }
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton} onPress={() => setShowImageOptions(true)}>
          <Ionicons name="add-circle-outline" size={24} color="#06C167" />
        </TouchableOpacity>
        <VoiceRecorder
          onRecordingComplete={(uri) => {
            if (!isTyping) {
              const newMessage: Message = {
                id: String(Date.now()),
                text: "",
                isAI: false,
                timestamp: new Date(),
                audioUri: uri,
              }
              setMessages([...messages, newMessage])
              flatListRef.current?.scrollToEnd({ animated: true })

              setIsTyping(true)
              setTimeout(() => {
                setIsTyping(false)
                setMessages((prev) => [
                  ...prev,
                  {
                    id: String(Date.now() + 1),
                    text: "Recebi sua mensagem de voz. Como posso ajudar?",
                    isAI: true,
                    timestamp: new Date(),
                    reactions: { likes: 0, dislikes: 0 },
                  },
                ])
                flatListRef.current?.scrollToEnd({ animated: true })
              }, 2000)
            }
          }}
        />
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Digite aqui"
          placeholderTextColor="#999"
          onSubmitEditing={handleSend}
          multiline
          editable={!isTyping}
        />
        <TouchableOpacity
          style={[styles.sendButton, inputText.trim() && !isTyping ? styles.sendButtonActive : null]}
          onPress={handleSend}
          disabled={!inputText.trim() || isTyping}
        >
          <Ionicons name="arrow-up" size={24} color={inputText.trim() && !isTyping ? "#fff" : "#999"} />
        </TouchableOpacity>
      </View>

      <Modal visible={showEditModal} transparent animationType="slide" onRequestClose={() => setShowEditModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Mensagem</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              value={editingMessage?.text}
              onChangeText={(text) => setEditingMessage((prev) => (prev ? { ...prev, text } : null))}
              multiline
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowEditModal(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => saveEdit(editingMessage?.text || "")}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showImageOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImageOptions(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Foto</Text>
              <TouchableOpacity onPress={() => setShowImageOptions(false)} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.imageOption}
              onPress={() => {
                takePhoto()
                setShowImageOptions(false)
              }}
            >
              <View style={styles.imageOptionIcon}>
                <Ionicons name="camera" size={24} color="#06C167" />
              </View>
              <Text style={styles.imageOptionText}>Tirar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageOption}
              onPress={() => {
                pickImage()
                setShowImageOptions(false)
              }}
            >
              <View style={styles.imageOptionIcon}>
                <Ionicons name="image" size={24} color="#06C167" />
              </View>
              <Text style={styles.imageOptionText}>Escolher da Galeria</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chatContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  marketDisplayContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    alignItems: "center",
    height: 80,
    marginBottom: Platform.OS === "ios" ? 40 : 10,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonActive: {
    backgroundColor: "#06C167",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  modalButton: {
    padding: 12,
    marginLeft: 8,
  },
  modalButtonPrimary: {
    backgroundColor: "#06C167",
    borderRadius: 8,
  },
  modalButtonText: {
    fontSize: 16,
    color: "#666",
  },
  modalButtonTextPrimary: {
    color: "#fff",
  },
  imageOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  imageOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  imageOptionText: {
    fontSize: 16,
    color: "#000",
  },
  suggestionsContainer: {
    marginBottom: 16,
  },
})

