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

      <Stack.Screen name="screens/user/LoginScreen" options={{
        headerTitle: "Battle Arena",
      }}></Stack.Screen>

      <Stack.Screen name="screens/user/RegisterScreen" options={{
        headerTitle: "Battle Arena",
      }}></Stack.Screen>

      <Stack.Screen name="screens/games/LeaderBoardScreen" options={{
        headerTitle: "Leader Board",
      }}></Stack.Screen>

      <Stack.Screen name="screens/games/trivia/QuestionAnswerScreen" options={{
        headerTitle: "Trivia",
        headerLeft: () => <></>
      }}></Stack.Screen>

      <Stack.Screen name="screens/games/trivia/TopicSelectionScreen" options={{
        headerTitle: "Topics",
        headerLeft: () => <></>
      }}></Stack.Screen>
    </Stack>
  </>
  );
}
