import { StatusBar } from "expo-status-bar"
import { useColorScheme } from "@/hooks/useColorScheme"

export function CustomStatusBar() {
  const colorScheme = useColorScheme()

  return <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
}

