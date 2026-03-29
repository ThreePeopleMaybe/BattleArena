import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, type RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GAME_TYPE_TRIVIA } from '../../../src/constants/gameTypes';
import { getArenaLeaderboard } from '../../api/arena';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation/types';
import { globalStyles } from '../../styles/globalStyles';
import { theme } from '../../theme';
import type { ArenaLeaderboardResult } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ArenaLeaderboard'>;
  route: RouteProp<RootStackParamList, 'ArenaLeaderboard'>;
};

export default function ArenaLeaderboardScreen({ route }: Props) {
  const { arenaId, gameTypeId } = route.params;
  const { user } = useAuth();
  const [rows, setRows] = useState<ArenaLeaderboardResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await getArenaLeaderboard(arenaId);
      setRows(data);
    } catch {
      setError('Could not load leaderboard.');
      setRows([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [arenaId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void load();
    }, [load])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    void load();
  }, [load]);

  const currentUserId = user?.userId;

  return (
    <ScrollView
      style={globalStyles.screenContainer}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
        />
      }
    >
      <Text style={styles.subtitle}>
        { gameTypeId === GAME_TYPE_TRIVIA 
        ? 'Ranked by wins, then total correct answers, then by speed.' 
        : 'Ranked by wins, then by speed.' }
      </Text>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.spinner} />
      ) : null}

      {error ? (
        <View style={styles.errorBlock}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={globalStyles.secondaryButton} 
            onPress={() => void load()} 
            activeOpacity={0.8}
          >
            <Text style={globalStyles.secondaryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {!loading && !error && rows.length === 0 ? (
        <Text style={styles.emptyText}>No completed games in this arena yet. Play a challenge to appear here.</Text>
      ) : null}

      {!loading && rows.length > 0 ? (
        <View style={styles.card}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.colRank}>#</Text>
            <Text style={styles.colHeaderPlayer}>Player</Text>
            <Text style={styles.colStat}>W/L</Text>
            <Text style={styles.colStat}>Games</Text>
            {gameTypeId === GAME_TYPE_TRIVIA 
              ? <Text style={styles.colStatWide}>Correct Answers</Text>
              : null}
            <Text style={styles.colStatWide}>Time Taken</Text>
          </View>
          {rows.map((entry, index) => {
            const isYou = currentUserId != null && Number(entry.userId) === Number(currentUserId);
            return (
              <View
                key={`${entry.userId}-${index}`}
                style={[styles.row, index < rows.length - 1 && styles.rowBorder, isYou && styles.rowYou]}
              >
                <Text style={styles.colRank}>{index + 1}</Text>
                <View style={styles.nameCell}>
                  {isYou ? (
                    <Ionicons name="person" size={16} color={theme.colors.primary} style={styles.youIcon} />
                  ) : null}
                  <Text style={[styles.colNameText, isYou && styles.colNameYou]} numberOfLines={1}>
                    {entry.userName || 'Player'}
                    {isYou ? ' (you)' : ''}
                  </Text>
                </View>
                <Text style={styles.colStat}>{entry.wins}/{entry.losses}</Text>
                <Text style={styles.colStat}>{entry.gamesPlayed}</Text>
                {gameTypeId === GAME_TYPE_TRIVIA 
                  ? <Text style={styles.colStatWide}>{entry.totalCorrectAnswers}</Text>
                  : null}
                <Text style={styles.colStatWide}>{entry.totalTimeTakenInSeconds}</Text>
              </View>
            );
          })}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  spinner: {
    marginVertical: theme.spacing.xl,
  },
  errorBlock: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.md,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.surfaceLight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  headerRow: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceLight,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceLight,
  },
  rowYou: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },
  colRank: {
    width: 28,
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  colHeaderPlayer: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginRight: theme.spacing.xs,
  },
  nameCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    marginRight: theme.spacing.xs,
  },
  youIcon: {
    marginRight: 4,
  },
  colNameText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text,
  },
  colNameYou: {
    color: theme.colors.primary,
  },
  colStat: {
    width: 80,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  colStatWide: {
    width: 130,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
});