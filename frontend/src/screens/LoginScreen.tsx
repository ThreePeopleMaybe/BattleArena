import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useLoginForm } from '../hooks/useLoginForm';
import { RootStackParamList } from '../navigation/types';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const onLoggedIn = useCallback(() => navigation.navigate('Home'), [navigation]);
  const { email, setEmail, password, setPassword, error, submit } = useLoginForm(onLoggedIn);

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
        onPress={submit}
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