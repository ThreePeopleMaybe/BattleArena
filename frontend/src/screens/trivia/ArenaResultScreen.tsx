import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation/types';
import { getArenaById, type ArenaMember } from '../../storage/arenaStorage';
import { globalStyles } from '../../styles/globalStyles';
import { theme } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ArenaResult'>;
  route: RouteProp<RootStackParamList, 'ArenaResult'>;
};

function formatTime(ms: number): string {
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const s = sec % 60;
  return min > 0 ? `${min}:${s.toString().padStart(2, '0')}` : `${s}s`;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateSimulatedScore(userCorrect: number, total: number, memberId: string): { correct: number; timeMs: number } {
  const seed = memberId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const correct = Math.min(total, Math.max(0, userCorrect + Math.floor(seededRandom(seed) * 5) - 2));
  const timeMs = 15000 + Math.floor(seededRandom(seed + 1) * 60000);
  return { correct, timeMs };
}

interface ArenaPlayerResult {
  member: ArenaMember;
  correct: number;
  timeMs: number;
  isCurrentUser: boolean;
}

export default function ArenaResultScreen({ navigation, route }: Props) {
  const { arenaId, topicId, userCorrect, userTimeMs, questionCount } = route.params;
  const { user } = useAuth();
  const currentUserId = user?.email ?? '';

  const [arenaResults, setArenaResults] = useState<ArenaPlayerResult[]>([]);

  const leaderboard = useMemo(() => {
    if (arenaResults.length === 0) return [];
    return [...arenaResults].sort((a, b) => {
      if (b.correct !== a.correct) return b.correct - a.correct;
      return a.timeMs - b.timeMs;
    });
  }, [arenaResults]);

  const currentUserRank = useMemo(() => {
    const idx = leaderboard.findIndex((p) => p.isCurrentUser);
    return idx >= 0 ? idx + 1 : 0;
  }, [leaderboard]);

  useEffect(() => {
    if (!arenaId) return;
    getArenaById(arenaId).then((arena) => {
      if (!arena) return;
      const total = questionCount ?? 10;
      const currentUserInMembers = arena.members.some((m) => m.id === currentUserId);
      const results: ArenaPlayerResult[] = arena.members.map((m) => {
        if (m.id === currentUserId) {
          return { member: m, correct: userCorrect, timeMs: userTimeMs, isCurrentUser: true };
        }
        const sim = generateSimulatedScore(userCorrect, total, m.id);
        return { member: m, correct: sim.correct, timeMs: sim.timeMs, isCurrentUser: false };
      });

      if (!currentUserInMembers) {
        const displayName = user?.email?.split('@')[0] ?? 'You';
        results.push({
          member: { id: currentUserId, name: displayName, joinedAt: Date.now() },
          correct: userCorrect,
          timeMs: userTimeMs,
          isCurrentUser: true,
        });
      }
      setArenaResults(results);
    });
  }, [arenaId, currentUserId, userCorrect, userTimeMs, user?.email, questionCount]);

  return (
    <ScrollView style={globalStyles.screenContainer} contentContainerStyle={styles.content}>
      <Text style={globalStyles.screenTitleLarge}>Arena results</Text>
      <View style={styles.scoreCard}>
        {leaderboard.map((p, index) => (
          <View
            key={p.member.id}
            style={[
              styles.row,
              index < leaderboard.length - 1 && styles.rowBorder,
              p.isCurrentUser && styles.rowHighlight,
            ]}
          >
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={[styles.label, p.isCurrentUser && styles.labelYou]}>
              {p.isCurrentUser ? 'You' : p.member.name}
            </Text>
            <Text style={styles.value}>{p.correct} correct</Text>
            <Text style={styles.time}>{formatTime(p.timeMs)}</Text>
          </View>
        ))}
      </View>
      {currentUserRank === 1 && leaderboard.length > 1 && (
        <Text style={styles.arenaWinnerText}>You won the arena!</Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={() => navigation.navigate('ArenaLobby', { arenaId })}
          activeOpacity={0.8}
        >
          <Text style={globalStyles.primaryButtonText}>Back to arena</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.secondaryButton}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.8}
        >
          <Text style={globalStyles.secondaryButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 0,
    paddingBottom: theme.spacing.xl,
  },
  scoreCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceLight,
  },
  rowHighlight: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  rank: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.textMuted,
    width: 24,
    marginRight: theme.spacing.sm,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  labelYou: {
    color: theme.colors.primary,
  },
  value: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    marginRight: theme.spacing.md,
  },
  time: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  actions: {
    gap: theme.spacing.md,
  },
  arenaWinnerText: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.success,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
});