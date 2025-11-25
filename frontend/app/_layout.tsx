import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
  <>
    <StatusBar barStyle={"light-content"}/>
    <Stack>
      <Stack.Screen name="index" options={{
        headerTitle: "Battle Arena",
        headerLeft: () => <></>
      }}></Stack.Screen>

      <Stack.Screen name="screens/user/login" options={{
        headerTitle: "Battle Arena",
      }}></Stack.Screen>

      <Stack.Screen name="screens/user/register" options={{
        headerTitle: "Battle Arena",
      }}></Stack.Screen>

      <Stack.Screen name="screens/games/leaderboard" options={{
        headerTitle: "Leader Board",
      }}></Stack.Screen>

      <Stack.Screen name="screens/games/trivia/questionanswer" options={{
        headerTitle: "Trivia",
        headerLeft: () => <></>
      }}></Stack.Screen>
    </Stack>
  </>
  );
}
