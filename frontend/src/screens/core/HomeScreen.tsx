import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getHomeGameMeta } from '../../constants/gameTypes';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation/types';
import { globalStyles } from '../../styles/globalStyles';
import { theme } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation, route }: Props) {
  const gameTypeId = route.params?.gameTypeId ?? 0;
  const { isLoggedIn } = useAuth();
  const { title: screenTitle } = getHomeGameMeta(gameTypeId);

  return (
    <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}>
      <View style={styles.headerRow}>
        <Text style={globalStyles.screenTitle}>{screenTitle}</Text>
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
        onPress={() => navigation.navigate('Challenge', { gameTypeId: gameTypeId }  )}
        activeOpacity={0.8}
      >
        <Text style={styles.cardIcon}>🏆</Text>
        <Text style={styles.cardTitle}>Challenge</Text>
        <Text style={styles.cardDesc}>Challenge your friends or stranger to a game.</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.arenaCard]}
        onPress={() => navigation.navigate('ArenaHome', { gameTypeId: gameTypeId })}
        activeOpacity={0.8}
      >
        <Text style={styles.cardIcon}>🏟️</Text>
        <Text style={styles.cardTitle}>Tournament</Text>
        <Text style={styles.cardDesc}>Create or join tournaments. View your tournaments and host multiplayer sessions.</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.card, styles.resultsCard]}
        onPress={() => navigation.navigate('GameResults', { gameTypeId })}
        activeOpacity={0.8}
      >
        <Text style={styles.cardIcon}>📋</Text>
        <Text style={styles.cardTitle}>My results</Text>
        <Text style={styles.cardDesc}>See scores and times from games you finished while logged in.</Text>
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
  resultsCard: {
    borderColor: theme.colors.primary,
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