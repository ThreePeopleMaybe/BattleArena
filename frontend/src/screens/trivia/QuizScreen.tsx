import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GAME_TYPE_TRIVIA } from '../../../src/constants/gameTypes';
import { finishGame } from '../../api/game';
import {
  createTriviaGame,
  getTriviaGameQuestionsByGameId,
  insertTriviaGameResult,
} from '../../api/triviaGame';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation/types';
import { globalStyles } from '../../styles/globalStyles';
import { theme } from '../../theme';
import { Question, QuizQuestionResult, QuizResult } from '../../types';

const QUIZ_TIME_LIMIT_MS = 100 * 1000; // 100 seconds
const BATTLE_INTRO_COUNTDOWN_SEC = 5;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Quiz'>;
  route: RouteProp<RootStackParamList, 'Quiz'>;
};

function generateOpponentScore(userCorrect: number, total: number): { correct: number; timeMs: number } {
  const correct = Math.min(total, Math.max(0, userCorrect + Math.floor(Math.random() * 5) - 2));
  const timeMs = 15000 + Math.floor(Math.random() * 60000);
  return { correct, timeMs };
}

function countCorrectAnswers(results: QuizQuestionResult[]): number {
  return results.filter((r) => {
    const ch = r.selectedIndex >= 0 ? r.question.choices[r.selectedIndex] : undefined;
    return ch?.isCorrectChoice === true;
  }).length;
}

function buildTriviaResultDetails(
  results: QuizQuestionResult[],
  triviaGameQuestionIdsByQuestionId: Record<string, number>
): QuizResult[] {
  const details: QuizResult[] = [];
  for (const r of results) {
    const triviaQId = triviaGameQuestionIdsByQuestionId[String(r.question.id)];
    if (triviaQId == null) continue;
    if (r.selectedIndex < 0) continue;

    const choice = r.question.choices[r.selectedIndex];
    if (!choice) continue;
    const answerId = choice.id;
    if (!Number.isFinite(answerId)) continue;
    details.push({ questionId: triviaQId, choiceId: answerId });
  }
  return details;
}

export default function QuizScreen({ navigation, route }: Props) {
  const {
    topicId,
    wagerAmount,
    arenaId,
    fromChallenge,
    gameId,
  } = route.params;

  const { user } = useAuth();

  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const gameIdRef = useRef<number | null>(null);
  const triviaMapRef = useRef<Record<string, number>>({});

  const persistQuizResult = useCallback(
    (finalResults: QuizQuestionResult[], timeMs: number) => {
      const gameId = gameIdRef.current;
      const map = triviaMapRef.current;
      const userId = user?.userId;
      if (gameId == null || userId == null) return;

      const numberOfCorrectAnswers = countCorrectAnswers(finalResults);
      const timeTakenInSeconds = Math.max(0, Math.round(timeMs / 1000));
      const details = buildTriviaResultDetails(finalResults, map);

      void insertTriviaGameResult({
        gameId,
        userId,
        numberOfCorrectAnswers,
        timeTakenInSeconds,
        details,
      }).catch(() => {});
    },
    [user?.userId, topicId]
  );

  const [introCountdown, setIntroCountdown] = useState(() =>
    fromChallenge ? BATTLE_INTRO_COUNTDOWN_SEC : 0
  );

  const [quizStartMs, setQuizStartMs] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let introInterval: ReturnType<typeof setInterval> | null = null;

    setLoadError(null);
    setQuestions(null);
    gameIdRef.current = null;
    triviaMapRef.current = {};
    setQuizStartMs(null);

    void (async () => {
      try {
        if (gameId === null || gameId === undefined) {
          const created = await createTriviaGame({
            gameTypeId: GAME_TYPE_TRIVIA,
            wagerAmount: Math.max(0, Math.floor(wagerAmount ?? 0)),
            startedBy: user?.userId ?? 0,
            topicId: topicId,
            arenaId: arenaId,
          });

          if (cancelled) return;
          if (!created.questions.length) {
            setLoadError('No questions available for this topic.');
            return;
          }

          gameIdRef.current = created.gameId;
          setQuestions(created.questions);
        } else {
          const questions = await getTriviaGameQuestionsByGameId(gameId);
          if (cancelled) return;
          if (!questions.length) {
            setLoadError('No questions available for this game.');
            return;
          }

          await finishGame(gameId);
          if (cancelled) return;
          gameIdRef.current = gameId;
          triviaMapRef.current = {};
          setQuestions(questions);
        }
      } catch {
        if (!cancelled) {
          setLoadError('Could not start quiz. Check your connection and try again.');
        }
      }
    })();

    if (fromChallenge) {
      setIntroCountdown(BATTLE_INTRO_COUNTDOWN_SEC);
      introInterval = setInterval(() => {
        setIntroCountdown((c) => {
          if (c <= 1) {
            if (introInterval !== null) {
              clearInterval(introInterval);
              introInterval = null;
            }
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } else {
      setIntroCountdown(0);
    }

  return () => {
      cancelled = true;
      if (introInterval !== null) {
        clearInterval(introInterval);
      }
    };
  }, [topicId, wagerAmount, gameId, fromChallenge, arenaId]);

  useEffect(() => {
    const ready = questions != null && questions.length > 0;
    const introDone = !fromChallenge || introCountdown === 0;
    if (ready && introDone && quizStartMs === null) {
      setQuizStartMs(Date.now());
    }
  }, [questions, fromChallenge, introCountdown, quizStartMs]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [questionResults, setQuestionResults] = useState<QuizQuestionResult[]>([]);
  const timeUpTriggered = useRef(false);

  useEffect(() => {
    if (questions == null || questions.length === 0) return;
    setCurrentIndex(0);
    setQuestionResults([]);
    setSelectedIndex(null);
    setAnswered(false);
  }, [questions]);

  useEffect(() => {
    const ready = questions != null && questions.length > 0;
    const introDone = !fromChallenge || introCountdown === 0;
    if (ready && introDone && quizStartMs === null) {
      setQuizStartMs(Date.now());
    }
  }, [questions, fromChallenge, introCountdown, quizStartMs]);

  useEffect(() => {
    if (quizStartMs == null) return;
    const interval = setInterval(() => setElapsed(Date.now() - quizStartMs), 500);
    return () => clearInterval(interval);
  }, [quizStartMs]);

  const question = questions != null ? questions[currentIndex] : undefined;
  const isLast = questions != null ? currentIndex === questions.length - 1 : false;

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (answered) return;
      setAnswered(true);
      setSelectedIndex(optionIndex);
    },
    [answered]
  );

  const goNext = useCallback(() => {
    if (!questions || questions.length === 0) return;
    if (!question) return;

    const resultEntry: QuizQuestionResult = { question, selectedIndex: selectedIndex ?? -1 };

    if (isLast) {
      if (quizStartMs == null) return;
      const timeMs = Date.now() - quizStartMs;
      const finalResults = [...questionResults, resultEntry];
      const userCorrect = countCorrectAnswers(finalResults);
      persistQuizResult(finalResults, timeMs);

      navigation.replace('QuizResult', {
        topicId,
        userCorrect,
        userTimeMs: timeMs,
        questionResults: finalResults,
        wagerAmount,
        fromChallenge,
        arenaId
      });
      return;
    }

    setQuestionResults((prev) => [...prev, resultEntry]);
    setCurrentIndex((i) => i + 1);
    setSelectedIndex(null);
    setAnswered(false);
  }, [
    isLast,
    quizStartMs,
    navigation,
    topicId,
    selectedIndex,
    question,
    questionResults,
    wagerAmount,
    arenaId,
    fromChallenge,
    persistQuizResult,
    questions,
  ]);

  useEffect(() => {
    if (!answered || selectedIndex === null) return;
    const timeout = setTimeout(goNext, 100);
    return () => clearTimeout(timeout);
  }, [answered, selectedIndex, goNext]);

  useEffect(() => {
    if (quizStartMs == null) return;
    if (!questions || questions.length === 0) return;
    if (elapsed < QUIZ_TIME_LIMIT_MS || timeUpTriggered.current) return;
    
    timeUpTriggered.current = true;

    const timeMs = Math.min(elapsed, QUIZ_TIME_LIMIT_MS);
    const unansweredResults: QuizQuestionResult[] = questions
      .slice(currentIndex)
      .map((q) => ({ question: q, selectedIndex: -1 }));

    const fullResults = [...questionResults, ...unansweredResults];
    const userCorrect = countCorrectAnswers(fullResults);
    persistQuizResult(fullResults, timeMs);

  navigation.replace('QuizResult', {
      topicId,
      userCorrect,
      userTimeMs: timeMs,
      questionResults: fullResults,
      wagerAmount,
      fromChallenge,
      arenaId
    })
  }, [
    quizStartMs,
    elapsed,
    currentIndex,
    questionResults,
    questions,
    navigation,
    topicId,
    wagerAmount,
    arenaId,
    fromChallenge,
    persistQuizResult,
  ]);

  if (loadError) {
    return (
      <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}>
        <Text style={styles.text}>{loadError}</Text>
        <TouchableOpacity
          style={[globalStyles.smallButton, styles.goBackBtn]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={globalStyles.smallButtonText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (fromChallenge && introCountdown > 0) {
    return (
      <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding, styles.introWrap]}>
        <Text style={styles.introLabel}>Starting in</Text>
        <Text style={styles.introNumber}>{introCountdown}</Text>
        <Text style={styles.introHint}>
          {questions === null ? 'Loading questions...' : 'Get ready!'}
        </Text>
        {questions === null ? (
          <ActivityIndicator size="small" color={theme.colors.primary} style={styles.introSpinner} />
        ) : null}
      </View>
    );
  }

  if (questions === null) {
    return (
      <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding, styles.loadingWrap]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.text, styles.loadingLabel]}>Loading questions...</Text>
      </View>
    );
  }

  if (!question) {
    return (
      <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

return (
  <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}>
    <View style={styles.header}>
      <Text style={styles.progress}>
        {currentIndex + 1} / {questions.length}
      </Text>
      <Text style={styles.timer}>{Math.floor(elapsed / 1000)} / 100s</Text>
    </View>

    <Text style={styles.question}>{question.text}</Text>

    <View style={styles.options}>
      {question.choices.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.option, selectedIndex === index && styles.optionSelected]}
          onPress={() => handleAnswer(index)}
          disabled={answered}
          activeOpacity={0.7}
        >
          <Text style={styles.optionText}>{option.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  progress: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
  },
  timer: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  question: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    lineHeight: 32,
  },
  options: {
    gap: theme.spacing.sm,
  },
  option: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.surfaceLight,
  },
  optionSelected: {
    borderColor: theme.colors.primary,
  },
  optionText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
  },
  goBackBtn: {
    marginTop: theme.spacing.lg,
    alignSelf: 'flex-start',
  },
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  loadingLabel: {
    marginTop: theme.spacing.sm,
  },
  introWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  introLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  introNumber: {
    fontSize: 44,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  introHint: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.md,
  },
  introSpinner: {
    marginTop: theme.spacing.sm,
  }
});