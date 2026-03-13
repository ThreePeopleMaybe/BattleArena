import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { theme } from '../../theme';
import { globalStyles } from '../../styles/globalStyles';
import { RootStackParamList } from '../../navigation/types';

const WAIT_SECONDS = 15;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'WaitingForPlayers'>;
  route: RouteProp<RootStackParamList, 'WaitingForPlayers'>;
};

export default function WaitingForPlayersScreen({ navigation, route }: Props) {
  const params = route.params;
  const isArena = params.mode === 'arena';
  const [secondsLeft, setSecondsLeft] = useState(WAIT_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (isArena) {
            navigation.replace('ArenaResult', {
              arenaId: params.arenaId,
              userCorrect: params.userCorrect,
              userTimeMs: params.userTimeMs,
              questionCount: params.questionCount,
            });
          } else {
            navigation.replace('BattleResult', {
              topicId: params.topicId,
              userCorrect: params.userCorrect,
              userTimeMs: params.userTimeMs,
              opponentCorrect: params.opponentCorrect,
              opponentTimeMs: params.opponentTimeMs,
              opponentName: params.opponentName,
              questionResults: params.questionResults,
              wagerAmount: params.wagerAmount,
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isArena, navigation, params]);

  return (
    <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding, styles.container]}>
      <ActivityIndicator size="large" color={theme.colors.primary} style={styles.spinner} />
      <Text style={styles.title}>
        {isArena ? 'Waiting for other players to finish' : `Waiting for ${params.opponentName} to finish`}
      </Text>
      <Text style={styles.subtitle}>
        You've completed the quiz. Results will show when everyone is done.
      </Text>
      <View style={styles.countdownBox}>
        <Text style={styles.countdownLabel}>Showing results in</Text>
        <Text style={styles.countdownNumber}>{secondsLeft}s</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  countdownBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
  },
  countdownLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  countdownNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.primary,
  },
});