import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../theme';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Home'> };

export default function HomeScreen({ navigation }: Props) {
  const { isLoggedIn } = useAuth();

  return (
    <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}>
      <View style={styles.headerRow}>
        <Text style={globalStyles.screenTitle}></Text>
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
          <TouchableOpacity style={styles.authLink} onPress={() => navigation.navigate('Login')} activeOpacity={0.8}>
            <Text style={styles.authLinkText}>Log in</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.authLink} onPress={() => navigation.navigate('SignUp')} activeOpacity={0.8}>
            <Text style={styles.authLinkText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.card, styles.challengeCard]}
        onPress={() => navigation.navigate('Challenge')}
        activeOpacity={0.8}
      >
        <Text style={styles.cardIcon}>🏆</Text>
        <Text style={styles.cardTitle}>Challenge</Text>
        <Text style={styles.cardDesc}>View past quizzes and challenge opponents by category.</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.battleCard]}
        onPress={() => navigation.navigate('SelectOpponent', { fromChallenge: false })}
        activeOpacity={0.8}
      >
        <Text style={styles.cardIcon}>⚔️</Text>
        <Text style={styles.cardTitle}>Battle Mode</Text>
        <Text style={styles.cardDesc}>Same topic, same questions. Most correct in the shortest time wins.</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.arenaCard]}
        onPress={() => navigation.navigate('ArenaHome')}
        activeOpacity={0.8}
      >
        <Text style={styles.cardIcon}>🏟️</Text>
        <Text style={styles.cardTitle}>Arena</Text>
        <Text style={styles.cardDesc}>Create or join arenas. View your arenas and host multiplayer sessions.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  profileButton: {
    padding: theme.spacing.xs,
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
  soloCard: {
    borderColor: theme.colors.primary,
  },
  battleCard: {
    borderColor: theme.colors.accent,
  },
  arenaCard: {
    borderColor: theme.colors.success,
  },
  challengeCard: {
    borderColor: theme.colors.accent,
  },
  teamCard: {
    borderColor: theme.colors.surfaceLight,
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