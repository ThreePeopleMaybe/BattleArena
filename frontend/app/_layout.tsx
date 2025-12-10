import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerTitle: "Battle Arena",
              headerLeft: () => <></>,
            }}
          />
          <Stack.Screen
            name="screens/user/loginScreen"
            options={{
              headerTitle: "Battle Arena",
            }}
          />
          <Stack.Screen
            name="screens/games/leaderBoardScreen"
            options={{
              headerTitle: "Leader Board",
            }}
          />
        </Stack>
      </QueryClientProvider>
    </>
  );
}