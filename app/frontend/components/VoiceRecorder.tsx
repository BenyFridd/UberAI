"use client"

import { useState, useEffect, useRef } from "react"
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native"
import { Audio } from "expo-av"
import { Ionicons } from "@expo/vector-icons"

interface VoiceRecorderProps {
  onRecordingComplete: (uri: string) => void
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const progress = useRef(new Animated.Value(0)).current
  const recordingRef = useRef<Audio.Recording | null>(null)
  const durationInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync()
      }
      if (durationInterval.current) {
        clearInterval(durationInterval.current)
      }
    }
  }, [])

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      const { recording } = await Audio.Recording.createAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
          extension: ".m4a",
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
        },
        ios: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
          extension: ".m4a",
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.MAX,
        },
      })

      setRecording(recording)
      recordingRef.current = recording
      setIsRecording(true)
      setRecordingDuration(0)

      // Start duration counter
      durationInterval.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1000)
      }, 1000)

      progress.setValue(0)
      Animated.timing(progress, {
        toValue: 1,
        duration: 60000, // 60 seconds max recording
        useNativeDriver: false,
      }).start()
    } catch (err) {
      console.error("Failed to start recording", err)
    }
  }

  async function stopRecording() {
    if (!recording) return

    try {
      setIsRecording(false)
      if (durationInterval.current) {
        clearInterval(durationInterval.current)
      }

      await recording.stopAndUnloadAsync()
      const uri = recording.getURI()
      setRecording(null)
      recordingRef.current = null
      progress.setValue(0)
      setRecordingDuration(0)

      if (uri) {
        onRecordingComplete(uri)
      }
    } catch (err) {
      console.error("Failed to stop recording", err)
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        style={[styles.button, isRecording && styles.recording]}
      >
        <Ionicons name={isRecording ? "stop" : "mic"} size={24} color={isRecording ? "#fff" : "#06C167"} />
      </TouchableOpacity>
      {isRecording && (
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
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  recording: {
    backgroundColor: "#06C167",
  },
  progressContainer: {
    position: "absolute",
    left: 48,
    right: 8,
    height: 2,
    backgroundColor: "#eee",
    borderRadius: 1,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#06C167",
    borderRadius: 1,
  },
})

