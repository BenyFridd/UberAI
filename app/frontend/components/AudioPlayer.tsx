"use client"

import { useState, useEffect, useRef } from "react"
import { View, TouchableOpacity, Text, StyleSheet, Animated } from "react-native"
import { Audio } from "expo-av"
import { Ionicons } from "@expo/vector-icons"

interface AudioPlayerProps {
  uri: string
}

export function AudioPlayer({ uri }: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [position, setPosition] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const progress = useRef(new Animated.Value(0)).current

  useEffect(() => {
    loadSound()
    return () => {
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [uri, sound])

  async function loadSound() {
    try {
      setIsLoading(true)
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { progressUpdateIntervalMillis: 100 },
        onPlaybackStatusUpdate,
      )
      setSound(newSound)
      setIsLoading(false)
    } catch (err) {
      console.error("Failed to load sound", err)
      setIsLoading(false)
    }
  }

  function onPlaybackStatusUpdate(status: any) {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0)
      setPosition(status.positionMillis || 0)
      setIsPlaying(status.isPlaying)
      progress.setValue(status.positionMillis / status.durationMillis)
    }
  }

  async function togglePlayback() {
    if (!sound) return

    try {
      if (isPlaying) {
        await sound.pauseAsync()
      } else {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        })
        await sound.playAsync()
      }
    } catch (err) {
      console.error("Failed to toggle playback", err)
    }
  }

  function formatTime(ms: number) {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={togglePlayback} style={styles.playButton} disabled={isLoading}>
        <Ionicons name={isPlaying ? "pause" : "play"} size={16} color="#fff" />
      </TouchableOpacity>
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
      <Text style={styles.time}>{formatTime(position)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#06C167",
    borderRadius: 16,
    padding: 6,
    height: 32,
    marginVertical: 2,
  },
  playButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  progressContainer: {
    flex: 1,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 1,
    marginHorizontal: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 1,
  },
  time: {
    fontSize: 12,
    color: "#fff",
    minWidth: 35,
    textAlign: "right",
  },
})

