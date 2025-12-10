import GameSelectionButton from "@/components/gameSelectionButton";
import { useRouter } from "expo-router";
import { Image, TouchableOpacity, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./ThemeProvider";

const queryClient = new QueryClient();

export default function Index() {
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 20,
                right: 20,
              }}
              onPress={() => router.push("/screens/user/profileScreen")}
            >
              <Image
                source={require("@/assets/images/icon.png")}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </TouchableOpacity>

            <GameSelectionButton
              iconName={require("@/assets/images/splash-icon.png")}
              onPress={() => router.push("/screens/games/trivia/teamManagementScreen")}
            />
            <GameSelectionButton
              iconName={require("@/assets/images/icons/trivia.png")}
              onPress={() => router.push("/screens/games/trivia/topicSelectionScreen")}
            />
          </View>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}