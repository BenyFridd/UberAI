"use client"

import { useEffect, useRef } from "react"
import { View, StyleSheet, Animated, Image } from "react-native"

export function TypingIndicator() {
  const dot1Opacity = useRef(new Animated.Value(0.3)).current
  const dot2Opacity = useRef(new Animated.Value(0.3)).current
  const dot3Opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dot1Opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        dot1Opacity.setValue(0.3)
        dot2Opacity.setValue(0.3)
        dot3Opacity.setValue(0.3)
        animateDots()
      })
    }

    animateDots()
  }, [dot1Opacity, dot2Opacity, dot3Opacity])

  return (
    <View style={styles.container}>
      <View style={styles.bubbleContainer}>
        <View style={styles.aiIcon}>
          <Image source={require("@/assets/images/ailogo2.jpg")} style={styles.aiIconImage} />
        </View>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
          <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
          <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginBottom: 16,
  },
  bubbleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#06C167",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: 8,
  },
  aiIconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  dotsContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#06C167",
    marginHorizontal: 2,
  },
})

