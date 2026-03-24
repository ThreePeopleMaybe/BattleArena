import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { UserDto } from '../api/users';
import { useAuth } from '../context/AuthContext';
import { useSignUpForm, type SignUpCredentials } from '../hooks/useSignUpForm';
import { RootStackParamList } from '../navigation/types';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
};

export default function SignUpScreen({ navigation }: Props) {
  const { login } = useAuth();

  const onSignedUp = useCallback(
    async (created: UserDto, { email, password }: SignUpCredentials) => {
      await login(email, password, { userId: created.id, username: created.username });
      navigation.navigate('Home');
    },
    [login, navigation]
  );

  const { form, setField, error, isSubmitting, submit } = useSignUpForm(onSignedUp);

  return (
    <KeyboardAvoidingView
      style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={globalStyles.screenTitleLarge}>Create account</Text>
        <Text style={globalStyles.screenSubtitle}>Sign up to save your progress and stats.</Text>

        {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

        <View style={globalStyles.fieldGroup}>
          <Text style={globalStyles.inputLabel}>Username</Text>
          <TextInput
            style={[globalStyles.input, globalStyles.inputInField]}
            placeholder="Choose a username"
            placeholderTextColor={theme.colors.textMuted}
            value={form.username}
            onChangeText={(v) => setField('username', v)}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={globalStyles.fieldGroup}>
          <Text style={globalStyles.inputLabel}>First name</Text>
          <TextInput
            style={[globalStyles.input, globalStyles.inputInField]}
            placeholder="Given name"
            placeholderTextColor={theme.colors.textMuted}
            value={form.firstName}
            onChangeText={(v) => setField('firstName', v)}
            autoCapitalize="words"
          />
        </View>

        <View style={globalStyles.fieldGroup}>
          <Text style={globalStyles.inputLabel}>Last name</Text>
          <TextInput
            style={[globalStyles.input, globalStyles.inputInField]}
            placeholder="Family name"
            placeholderTextColor={theme.colors.textMuted}
            value={form.lastName}
            onChangeText={(v) => setField('lastName', v)}
            autoCapitalize="words"
          />
        </View>

        <View style={globalStyles.fieldGroup}>
          <Text style={globalStyles.inputLabel}>Email</Text>
          <TextInput
            style={[globalStyles.input, globalStyles.inputInField]}
            placeholder="you@example.com"
            placeholderTextColor={theme.colors.textMuted}
            value={form.email}
            onChangeText={(v) => setField('email', v)}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
          />
        </View>

        <View style={globalStyles.fieldGroup}>
          <Text style={globalStyles.inputLabel}>Phone number</Text>
          <TextInput
            style={[globalStyles.input, globalStyles.inputInField]}
            placeholder="Mobile or landline"
            placeholderTextColor={theme.colors.textMuted}
            value={form.phone}
            onChangeText={(v) => setField('phone', v)}
            keyboardType="phone-pad"
            autoComplete="tel"
          />
        </View>

        <View style={globalStyles.fieldGroup}>
          <Text style={globalStyles.inputLabel}>Password</Text>
          <TextInput
            style={[globalStyles.input, globalStyles.inputInField]}
            placeholder="At least 6 characters"
            placeholderTextColor={theme.colors.textMuted}
            value={form.password}
            onChangeText={(v) => setField('password', v)}
            secureTextEntry
            autoComplete="password-new"
          />
        </View>

        <View style={globalStyles.fieldGroup}>
          <Text style={globalStyles.inputLabel}>Confirm password</Text>
          <TextInput
            style={[globalStyles.input, globalStyles.inputInField]}
            placeholder="Re-enter password"
            placeholderTextColor={theme.colors.textMuted}
            value={form.confirmPassword}
            onChangeText={(v) => setField('confirmPassword', v)}
            secureTextEntry
            autoComplete="password-new"
          />
        </View>

        <TouchableOpacity
          style={[
            globalStyles.primaryButton,
            styles.primaryButtonMargin,
            isSubmitting && styles.buttonDisabled,
          ]}
          onPress={submit}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          <Text style={globalStyles.primaryButtonText}>
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.cancelButton, styles.cancelButtonMargin]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          <Text style={globalStyles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.linkButton, styles.linkButtonMargin]}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          <Text style={globalStyles.linkText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl * 2,
  },
  primaryButtonMargin: { marginTop: theme.spacing.sm },
  cancelButtonMargin: { marginTop: theme.spacing.sm },
  linkButtonMargin: { marginTop: theme.spacing.xl },
  buttonDisabled: { opacity: 0.6 },
});