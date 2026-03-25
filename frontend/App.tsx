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
import LoginScreen from './src/screens/LoginScreen';
import MatchingOpponentScreen from './src/screens/MatchingOpponentScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SelectOpponentScreen from './src/screens/SelectOpponentScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ArenaHomeScreen from './src/screens/trivia/ArenaHomeScreen';
import ArenaLobbyScreen from './src/screens/trivia/ArenaLobbyScreen';
import ArenaResultScreen from './src/screens/trivia/ArenaResultScreen';
import BattleResultScreen from './src/screens/trivia/BattleResultScreen';
import BattleScreen from './src/screens/trivia/BattleScreen';
import ChallengeScreen from './src/screens/trivia/ChallengeScreen';
import JoinArenaScreen from './src/screens/trivia/JoinArenaScreen';
import QuizScreen from './src/screens/trivia/QuizScreen';
import TopicsScreen from './src/screens/trivia/TopicsScreen';
import WaitingForPlayersScreen from './src/screens/trivia/WaitingForPlayersScreen';
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
            <Stack.Screen
              name="SelectOpponent"
              component={SelectOpponentScreen}
              options={(opts) => ({ title: 'Battle', ...homeButtonHeader(opts) })}
            />
            <Stack.Screen name="MatchingOpponent" component={MatchingOpponentScreen} options={{ title: 'Finding opponent', ...noBackButton }} />
            <Stack.Screen name="Topics" component={TopicsScreen} options={{ title: 'Topics', ...noBackButton }} />
            <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz', ...noBackButton }} />
            <Stack.Screen name="Battle" component={BattleScreen} options={{ title: 'Battle', ...noBackButton }} />
            <Stack.Screen name="BattleResult" component={BattleResultScreen} options={{ title: 'Results', ...noBackButton }} />
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
              options={(opts) => ({ title: 'Arena' })}
            />
            <Stack.Screen name="WaitingForPlayers" component={WaitingForPlayersScreen} options={{ title: 'Results', ...noBackButton }} />
            <Stack.Screen name="ArenaResult" component={ArenaResultScreen} options={{ title: 'Arena Results', ...noBackButton }} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}