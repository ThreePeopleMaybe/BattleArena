import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { globalStyles } from '../styles/globalStyles';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email.');
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    await login(trimmedEmail, password);
    navigation.navigate('Home');
  };

  return (
    <KeyboardAvoidingView
      style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={globalStyles.screenTitleLarge}>Welcome back</Text>

      {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        placeholderTextColor={theme.colors.textMuted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Password"
        placeholderTextColor={theme.colors.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        style={[globalStyles.primaryButton, styles.primaryButtonMargin]} 
        onPress={handleLogin} 
        activeOpacity={0.8}
      >
        <Text style={globalStyles.primaryButtonText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[globalStyles.cancelButton, styles.cancelButtonMargin]} 
        onPress={() => navigation.goBack()} 
        activeOpacity={0.8}
      >
        <Text style={globalStyles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[globalStyles.linkButton, styles.linkButtonMargin]} 
        onPress={() => navigation.navigate('SignUp')} 
        activeOpacity={0.8}
      >
        <Text style={globalStyles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  primaryButtonMargin: { marginTop: theme.spacing.sm },
  cancelButtonMargin: { marginTop: theme.spacing.sm },
  linkButtonMargin: { marginTop: theme.spacing.xl },
});