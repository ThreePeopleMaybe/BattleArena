import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GAME_TYPE_TRIVIA } from '../../../src/constants/gameTypes';
import { RootStackParamList } from '../../navigation/types';
import { addToWallet } from '../../storage/walletStorage';
import { globalStyles } from '../../styles/globalStyles';
import { theme } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'QuizResult'>;
  route: RouteProp<RootStackParamList, 'QuizResult'>;
};

function formatTime(ms: number): string {
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const s = sec % 60;
  return min > 0 ? `${min}:${s.toString().padStart(2, '0')}` : `${s}s`;
}

export default function QuizResultScreen({ navigation, route }: Props) {
  const { userCorrect, userTimeMs, questionResults, wagerAmount } = route.params;
  const arenaId = route.params.arenaId ?? 0;
  const walletApplied = useRef(false);

  let winner: 'you' | 'opponent' | 'tie' = 'you';

  useEffect(() => {
    if (walletApplied.current || wagerAmount == null || wagerAmount <= 0) return;
    walletApplied.current = true;
    if (winner === 'you') addToWallet(wagerAmount);
    else if (winner === 'opponent') addToWallet(-wagerAmount);
  }, [wagerAmount, winner]);

  return (
    <ScrollView style={globalStyles.screenContainer} contentContainerStyle={styles.content}>
          <Text style={globalStyles.screenTitleLarge}>Quiz complete</Text>
          <View style={styles.soloScore}>
            <Text style={styles.soloScoreValue}>{userCorrect}/{questionResults?.length ?? 10}</Text>
            <Text style={styles.soloScoreLabel}>correct</Text>
            <Text style={styles.soloTime}>{formatTime(userTimeMs)}</Text>
          </View>

      {questionResults && questionResults.length > 0 && (
        <View style={styles.reviewSection}>
          <Text style={styles.reviewTitle}>Review</Text>
          {questionResults.map((item, index) => {
            const choices = item.question.choices;
            const selected = item.selectedIndex;
            const selectedChoice = 
              selected >= 0 && selected < choices.length ? choices[selected] : undefined;
            const correct = selectedChoice?.isCorrectChoice === true;

            return (
              <View 
                key={`${item.question.id}-${index}`}
                style={[styles.reviewRow, correct ? styles.reviewRowCorrect : styles.reviewRowWrong]}
              >
                <Text style={[styles.reviewIcon, correct ? styles.reviewStatusCorrect : styles.reviewStatusWrong]}>
                  {correct ? '✓' : 'X'}
                </Text>
                <Text style={styles.reviewQuestion} numberOfLines={2}>
                  {item.question.text}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.actions}>
      <TouchableOpacity
        style={globalStyles.primaryButton}
        onPress={() => {
            navigation.navigate('Challenge',  { arenaId: arenaId, gameTypeId: GAME_TYPE_TRIVIA });
        }}
        activeOpacity={0.8}>
        <Text style={globalStyles.primaryButtonText}>Battle again</Text>
      </TouchableOpacity>

        <TouchableOpacity
          style={globalStyles.secondaryButton}
          onPress={() => navigation.navigate('Home', { gameTypeId:GAME_TYPE_TRIVIA })}
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
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
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
  soloScore: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  soloScoreValue: {
    fontSize: 48,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  soloScoreLabel: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  soloTime: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  actions: {
    gap: theme.spacing.md,
  },
  reviewSection: {
    marginBottom: theme.spacing.xl,
  },
  reviewTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingLeft: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    borderLeftWidth: 3,
  },
  reviewRowCorrect: {
    borderLeftColor: theme.colors.success,
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
  },
  reviewRowWrong: {
    borderLeftColor: theme.colors.error,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  reviewIcon: {
    fontSize: 16,
    fontWeight: '700',
    width: 20,
    marginRight: theme.spacing.sm,
  },
  reviewStatusCorrect: {
    color: theme.colors.success,
  },
  reviewStatusWrong: {
    color: theme.colors.error,
  },
  reviewQuestion: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
});