import { Image, StyleSheet, View, Text } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function HomeScreen() {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.logoContainer}>
        <Image source={require("@/assets/images/uber-eats-icon.png")} style={styles.logo} resizeMode="contain" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#478778",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 230,
    height: 230,
    marginBottom: 1,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  uberText: {
    fontSize: 44,
    fontWeight: "500",
    color: "#FFFFFF",
    letterSpacing: -1,
  },
  eatsText: {
    fontSize: 44,
    fontWeight: "500",
    color: "#06C167",
    letterSpacing: -1,
    marginLeft: 8,
  },
})

