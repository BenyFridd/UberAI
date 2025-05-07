import { View, StyleSheet, Animated, Image, Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface HeaderProps {
  headerHeight: Animated.AnimatedInterpolation<string | number>
  fontSize: Animated.AnimatedInterpolation<string | number>
}

export function Header({ headerHeight, fontSize }: HeaderProps) {
  const insets = useSafeAreaInsets()

  return (
    <Animated.View
      style={[
        styles.header,
        {
          height: headerHeight,
          paddingTop: Platform.OS === "ios" ? insets.top : 0,
        },
      ]}
    >
      <View style={styles.headerContent}>
        <Animated.Text style={[styles.title, { fontSize }]}> AI Assistant</Animated.Text>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [
                {
                  scale: fontSize.interpolate({
                    inputRange: [20, 28],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Image source={require("@/assets/images/uber-eats-icon.png")} style={styles.logo} resizeMode="contain" />
        </Animated.View>
      </View>
      <View style={styles.divider} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    justifyContent: "flex-end",
    zIndex: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 9,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.5,
  },
  logoContainer: {
    height: 40,
    aspectRatio: 2 ,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
})

