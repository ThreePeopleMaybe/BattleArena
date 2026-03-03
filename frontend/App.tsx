import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/navigation/types';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TeamsScreen from './src/screens/TeamsScreen';
import CreateTeamScreen from './src/screens/CreateTeamScreen';
import SelectOpponentScreen from './src/screens/SelectOpponentScreen';
import MatchingOpponentScreen from './src/screens/MatchingOpponentScreen';
import TopicsScreen from './src/screens/trivia/TopicsScreen';
import QuizScreen from './src/screens/trivia/QuizScreen';
import BattleScreen from './src/screens/trivia/BattleScreen';
import BattleResultScreen from './src/screens/trivia/BattleResultScreen';
import { theme } from './src/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const noBackButton = { headerLeft: () => <View /> };

export default function App() {
  return (
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
          <Stack.Screen name="Teams" component={TeamsScreen} options={{ title: 'My teams' }} />
          <Stack.Screen 
            name="CreateTeam" 
            component={CreateTeamScreen} 
            options={({ route }) => ({ title: route.params?.teamId ? 'Edit team' : 'Create team' })} 
          />
          <Stack.Screen name="SelectOpponent" component={SelectOpponentScreen} options={{ title: 'Battle' }} />
          <Stack.Screen name="MatchingOpponent" component={MatchingOpponentScreen} options={{ title: 'Finding opponent', ...noBackButton }} />
          <Stack.Screen name="Topics" component={TopicsScreen} options={{ title: 'Topics', ...noBackButton }} />
          <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz', ...noBackButton }} />
          <Stack.Screen name="Battle" component={BattleScreen} options={{ title: 'Battle', ...noBackButton }} />
          <Stack.Screen name="BattleResult" component={BattleResultScreen} options={{ title: 'Results', ...noBackButton }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}