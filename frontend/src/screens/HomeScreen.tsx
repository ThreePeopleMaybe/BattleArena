import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { globalStyles } from '../styles/globalStyles';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Home'> };

export default function HomeScreen({ navigation }: Props) {
  const { isLoggedIn } = useAuth();

  return (
    <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}>
      <View style={styles.headerRow}>
        <Text style={globalStyles.screenTitle}>Trivia Battle</Text>
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
      <Text style={globalStyles.screenSubtitle}>Pick a mode. Prove you're the best.</Text>

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
        style={[styles.card, styles.soloCard]}
        onPress={() => navigation.navigate('Topics')}
        activeOpacity={0.8}
      >
        <Text style={styles.cardIcon}>📚</Text>
        <Text style={styles.cardTitle}>Solo Quiz</Text>
        <Text style={styles.cardDesc}>Choose a topic and answer questions at your own pace.</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.battleCard]}
        onPress={() => navigation.navigate('SelectOpponent')}
        activeOpacity={0.8}
      >
        <Text style={styles.cardIcon}>⚔️</Text>
        <Text style={styles.cardTitle}>Battle Mode</Text>
        <Text style={styles.cardDesc}>Same topic, same questions. Most correct in the shortest time wins.</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.teamCard]}
        onPress={() => navigation.navigate('Teams')}
        activeOpacity={0.8}
      >
        <Text style={styles.cardIcon}>👥</Text>
        <Text style={styles.cardTitle}>My teams</Text>
        <Text style={styles.cardDesc}>Create teams of opponents and manage your roster.</Text>
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