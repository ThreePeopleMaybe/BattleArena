import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { RootStackParamList } from './src/navigation/types';
import HomeScreen from './src/screens/HomeScreen';
import ArenaHomeScreen from './src/screens/arena/ArenaHomeScreen';
import ArenaLeaderboardScreen from './src/screens/arena/ArenaLeaderboardScreen';
import ArenaLobbyScreen from './src/screens/arena/ArenaLobbyScreen';
import JoinArenaScreen from './src/screens/arena/JoinArenaScreen';
import ChallengeScreen from './src/screens/core/ChallengeScreen';
import LoginScreen from './src/screens/core/LoginScreen';
import ProfileScreen from './src/screens/core/ProfileScreen';
import SignUpScreen from './src/screens/core/SignUpScreen';
import QuizResultScreen from './src/screens/trivia/QuizResultScreen';
import QuizScreen from './src/screens/trivia/QuizScreen';
import { theme } from './src/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
    mutations: { retry: 0 },
  },
});

const Stack = createNativeStackNavigator<RootStackParamList>();

const noBackButton = { headerLeft: () => <View /> };

const homeButtonHeader = ({ navigation }: { navigation: { navigate: (name: string) => void } }) => ({
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Home')}
      style={{ padding: 8, marginLeft: 4 }}
    >
      <Ionicons name="home-outline" size={24} color={theme.colors.text} />
    </TouchableOpacity>
  ),
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: { backgroundColor: theme.colors.background },
              headerTintColor: theme.colors.text,
              headerTitleStyle: { fontWeight: '700', fontSize: theme.fontSize.lg },
              headerShadowVisible: false,
              contentStyle: { backgroundColor: theme.colors.background },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Trivia Battle', ...noBackButton }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Log in', ...noBackButton }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign up', ...noBackButton }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
            <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz', ...noBackButton }} />
            <Stack.Screen name="QuizResult" component={QuizResultScreen} options={{ title: 'Results', ...noBackButton }} />
            <Stack.Screen
              name="Challenge"
              component={ChallengeScreen}
              options={(opts) => ({ title: 'Challenge', ...homeButtonHeader(opts) })}
            />
            <Stack.Screen name="ArenaHome" component={ArenaHomeScreen} options={{ title: 'Arena' }} />
            <Stack.Screen name="JoinArena" component={JoinArenaScreen} options={{ title: 'Join Arena' }} />
            <Stack.Screen
              name="ArenaLobby"
              component={ArenaLobbyScreen}
              options={() => ({ title: 'Arena' })}
            />
            <Stack.Screen
              name="ArenaLeaderboard"
              component={ArenaLeaderboardScreen}
              options={() => ({ title: 'Leaderboard'})}
            />  
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}