import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation/types';
import { joinArena } from '../../storage/arenaStorage';
import { globalStyles } from '../../styles/globalStyles';
import { theme } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'JoinArena'>;
};

export default function JoinArenaScreen({ navigation }: Props) {
  const { user, isLoggedIn } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setError('');
    if (!isLoggedIn || !user?.email) {
      setError('Please log in to join an arena.');
      return;
    }
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) {
      setError('Enter the arena code.');
      return;
    }

    const memberId = user.email;
    const displayName = user.email.split('@')[0] || user.email;

    setLoading(true);
    try {
      const arena = await joinArena(trimmedCode, memberId, displayName);
      if (arena) {
        navigation.replace('ArenaLobby', { arenaId: arena.id });
      } else {
        setError('Invalid or expired code. Please check and try again.');
      }
    } catch {
      setError('Failed to join arena.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}>
      <Text style={styles.label}>Arena code</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="e.g. ABC123"
        placeholderTextColor={theme.colors.textMuted}
        value={code}
        onChangeText={(t) => setCode(t.toUpperCase())}
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={6}
      />

      {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[globalStyles.primaryButton, loading && styles.buttonDisabled]}
        onPress={handleJoin}
        activeOpacity={0.8}
        disabled={loading || !isLoggedIn}
      >
        <Text style={globalStyles.primaryButtonText}>
          {loading ? 'Joining...' : 'Join arena'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginPrompt: {
    marginBottom: theme.spacing.lg,
  },
});