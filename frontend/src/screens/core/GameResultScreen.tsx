import { GAME_TYPE_TRIVIA } from '@/src/constants/gameTypes';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getUserGameResults } from '../../api/game';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation/types';
import { globalStyles } from '../../styles/globalStyles';
import { theme } from '../../theme';
import type { UserGameResult } from '../../types';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'GameResults'>;
    route: RouteProp<RootStackParamList, 'GameResults'>;
};

function formatDuration(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
}

function outcomeLabel(isWinner: boolean | null | undefined): string {
    if (isWinner === true) return 'Won';
    if (isWinner === false) return 'Lost';
    return '-';
}

function formatResultCreatedAt(iso: string | null | undefined): string {
    if (iso == null || iso === '') return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

function topicLabel(row: UserGameResult): string {
    const t = row.topicName?.trim();
    return t != null && t.length > 0 ? t : '-';
}

function opponentNameLabel(row: UserGameResult): string {
    const n = row.opponentUserName?.trim();
    return n != null && n.length > 0 ? n : '-';
}

function resultCell(gid: number, numberOfCorrectAnswers?: number, totalSeconds?: number): string {
    const correct = numberOfCorrectAnswers ?? 0;
    const time = totalSeconds ?? 0;
    if (correct === 0 && time === 0) return '-';
    if (gid === GAME_TYPE_TRIVIA) {
        return `${correct} / ${formatDuration(time)}`;
    } else {
        return `${formatDuration(time)}`;
    }
}

export default function GameResultsScreen({ navigation, route }: Props) {
  const { gameTypeId } = route.params;
  const { user, isLoggedIn } = useAuth();
  const [rows, setRows] = useState<UserGameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const uid = user?.userId;
    if (uid == null) {
      setRows([]);
      setLoading(false);
      setError(null);
      return;
    }

    setError(null);
    try {
      const data = await getUserGameResults(uid, gameTypeId);
      setRows(data);
    } catch {
      setRows([]);
      setError('Could not load your results.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.userId, gameTypeId]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    void load();
  }, [load]);

  if (!isLoggedIn || user?.userId == null) {
    return (
      <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding, styles.centered]}>
        <Text style={globalStyles.emptyState}>Log in to see your game results.</Text>
        <TouchableOpacity
          style={[globalStyles.primaryButton, styles.loginBtn]}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <Text style={globalStyles.primaryButtonText}>Log in</Text>
        </TouchableOpacity>
      </View>
    );
  }

return (
  <ScrollView
    style={globalStyles.screenContainer}
    contentContainerStyle={styles.content}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
    }
  >
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
      <Text style={styles.emptyText}>No finished games yet.</Text>
    ) : null}

    {!loading && rows.length > 0 ? (
      <View style={styles.card}>
        <View style={styles.tableInner}>
          <View style={[styles.row, styles.headerRow]}>
            {gameTypeId === GAME_TYPE_TRIVIA ? (
              <View style={styles.cellCol}>
                <Text style={styles.colHeaderText}>Topic</Text>
              </View>
            ) : null}
            <View style={styles.cellCol}>
              <Text style={styles.colHeaderText}>Created</Text>
            </View>
            <View style={styles.cellCol}>
              <Text style={styles.colHeaderText}>You</Text>
            </View>
            <View style={styles.cellCol}>
              <Text style={styles.colHeaderText}>Opponent</Text>
            </View>
            <View style={styles.cellCol}>
              <Text style={styles.colHeaderText}>Result</Text>
            </View>
          </View>

          {rows.map((item, index) => (
            <View
              key={String(item.id)}
              style={[styles.row, index < rows.length - 1 && styles.rowBorder]}
            >
              {gameTypeId === GAME_TYPE_TRIVIA ? (
                <View style={styles.cellCol}>
                  <Text style={styles.colBodyText} numberOfLines={2}>
                    {topicLabel(item)}
                  </Text>
                </View>
              ) : null}
              <View style={styles.cellCol}>
                <Text style={styles.colBodyTextMuted} numberOfLines={2}>
                  {formatResultCreatedAt(item.createdAt)}
                </Text>
              </View>
              <View style={styles.cellCol}>
                <Text style={styles.colBodyText}>
                  {resultCell(gameTypeId, item.numberOfCorrectAnswers, item.timeTakenInSeconds)}
                </Text>
              </View>
              <View style={styles.cellCol}>
                <Text style={styles.colOpponentName} numberOfLines={1}>
                  {opponentNameLabel(item)}
                </Text>
                <Text style={styles.colOpponentStats} numberOfLines={2}>
                  {resultCell(
                    gameTypeId,
                    item.opponentNumberOfCorrectAnswers,
                    item.opponentTimeTakenInSeconds
                  )}
                </Text>
              </View>
              <View style={styles.cellCol}>
                <Text
                  style={[
                    styles.colBodyText,
                    item.isWinner === true && styles.colResultWon,
                    item.isWinner === false && styles.colResultLost,
                  ]}
                >
                  {outcomeLabel(item.isWinner)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    ) : null}
  </ScrollView>
);
}
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  loginBtn: {
    marginTop: theme.spacing.lg,
    minWidth: 200,
  },
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
    alignSelf: 'stretch',
  },
  tableInner: {
    width: '100%',
    paddingBottom: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
    gap: theme.spacing.xs,
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
  cellCol: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  colHeaderText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  colBodyText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  colOpponentName: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 2,
    width: '100%',
  },
  colOpponentStats: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textMuted,
    textAlign: 'center',
    width: '100%',
  },
  colBodyTextMuted: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  colResultWon: {
    color: theme.colors.success,
  },
  colResultLost: {
    color: theme.colors.textMuted,
  },
});