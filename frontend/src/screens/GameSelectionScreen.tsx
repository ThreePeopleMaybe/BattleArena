import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GAME_TYPE_ARCHERY, GAME_TYPE_SUDOKU, GAME_TYPE_TRIVIA } from '../constants/gameTypes';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GameSelection'>;
};

export default function GameSelectionScreen({ navigation }: Props) {
  const { isLoggedIn } = useAuth();

  return (
    <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}>
      <View style={styles.headerRow}>
        <View style={styles.headerSpacer} />
        {isLoggedIn ? (
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <Ionicons name="person-circle-outline" size={32} color={theme.colors.primary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {!isLoggedIn && (
        <View style={styles.authRow}>
          <TouchableOpacity 
            style={styles.authLink} 
            onPress={() => navigation.navigate('Login')} 
            activeOpacity={0.8}
          >
            <Text style={styles.authLinkText}>Log in</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.authLink} 
            onPress={() => navigation.navigate('SignUp')} 
            activeOpacity={0.8}
          >
            <Text style={styles.authLinkText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.card, styles.triviaCard]}
        onPress={() => navigation.navigate('Home', { gameTypeId: GAME_TYPE_TRIVIA })}
        activeOpacity={0.8}
      >
        <Text style={styles.cardIcon}>🧠</Text>
        <Text style={styles.cardTitle}>Trivia</Text>
        <Text style={styles.cardDesc}>Challenges, quizzes, and tournaments.</Text>
      </TouchableOpacity>

     <TouchableOpacity
    style={[styles.card, styles.sudokuCard]}
    onPress={() => navigation.navigate('Home', { gameTypeId: GAME_TYPE_SUDOKU })}
    activeOpacity={0.8}
    >
    <Text style={styles.cardIcon}>🔢</Text>
    <Text style={styles.cardTitle}>Sudoku</Text>
    <Text style={styles.cardDesc}>
        Classic 9x9 logic puzzles. Fill the grid with no repeats per row, column, or box.
    </Text>
    </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.archeryCard]}
        onPress={() => navigation.navigate('Home', { gameTypeId: GAME_TYPE_ARCHERY })}
        activeOpacity={0.8}
      >
        <Text style={styles.cardIcon}>🎯</Text>
        <Text style={styles.cardTitle}>Archery</Text>
        <Text style={styles.cardDesc}>Five arrows per round. Watch the wind and tap to aim.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing.sm,
  },
  headerSpacer: {
    flex: 1,
  },
  profileButton: {
    padding: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  authRow: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  authLink: {
    paddingVertical: theme.spacing.xs,
  },
  authLinkText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
  },
  triviaCard: {
    borderColor: theme.colors.accent,
  },
  sudokuCard: {
    borderColor: theme.colors.primaryLight,
  },
  archeryCard: {
    borderColor: theme.colors.primary,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  cardDesc: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
  },
});