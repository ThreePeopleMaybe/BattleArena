import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { getQuestionsForTopic, getQuestionsFromTopics } from '../../data/questions';
import { Question, QuizQuestionResult } from '../../types';
import { theme } from '../../theme';
import { globalStyles } from '../../styles/globalStyles';
import { RootStackParamList } from '../../navigation/types';

const QUIZ_TIME_LIMIT_MS = 100 * 1000; // 100 seconds

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Quiz'>;
  route: RouteProp<RootStackParamList, 'Quiz'>;
};

function generateOpponentScore(userCorrect: number, total: number): { correct: number; timeMs: number } {
  const correct = Math.min(total, Math.max(0, userCorrect + Math.floor(Math.random() * 5) - 2));
  const timeMs = 15000 + Math.floor(Math.random() * 60000);
  return { correct, timeMs };
}

export default function QuizScreen({ navigation, route }: Props) {
  const { topicId, opponentTopicId, battleMode, opponentName, wagerAmount } = route.params;
  
  const [questions] = useState<Question[]>(() => 
    opponentTopicId
      ? getQuestionsFromTopics(topicId, opponentTopicId, 10)
      : getQuestionsForTopic(topicId, 10)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [questionResults, setQuestionResults] = useState<QuizQuestionResult[]>([]);
  const timeUpTriggered = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => setElapsed(Date.now() - startTime), 500);
    return () => clearInterval(interval);
  }, [startTime]);

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (answered) return;
      setAnswered(true);
      setSelectedIndex(optionIndex);
    },
    [answered]
  );

  const goNext = useCallback(() => {
    const resultEntry: QuizQuestionResult = { question, selectedIndex: selectedIndex ?? -1 };
    
    if (isLast) {
      const timeMs = Date.now() - startTime;
      const finalResults = [...questionResults, resultEntry];
      const userCorrect = finalResults.filter((r) => r.selectedIndex === r.question.correctIndex).length;
      const total = questions.length;
      
      let opponentCorrect = 0;
      let opponentTimeMs = 0;
      let name = '';

      if (battleMode && opponentName) {
        const opp = generateOpponentScore(userCorrect, total);
        opponentCorrect = opp.correct;
        opponentTimeMs = opp.timeMs;
        name = opponentName;
      }

      navigation.replace('BattleResult', {
        topicId,
        userCorrect,
        userTimeMs: timeMs,
        opponentCorrect,
        opponentTimeMs,
        opponentName: name,
        questionResults: finalResults,
        wagerAmount,
      });
      return;
    }

    setQuestionResults((prev) => [...prev, resultEntry]);
    setCurrentIndex((i) => i + 1);
    setSelectedIndex(null);
    setAnswered(false);
  }, [isLast, startTime, navigation, topicId, selectedIndex, question, battleMode, opponentName, questions.length, questionResults, wagerAmount]);

  // Auto-advance after any answer
  useEffect(() => {
    if (!answered || selectedIndex === null) return;
    const timeout = setTimeout(goNext, 800); // Small delay to show selection
    return () => clearTimeout(timeout);
  }, [answered, selectedIndex, goNext]);

  // 100 second time limit
  useEffect(() => {
    if (elapsed < QUIZ_TIME_LIMIT_MS || timeUpTriggered.current) return;
    timeUpTriggered.current = true;
    
    const timeMs = Math.min(elapsed, QUIZ_TIME_LIMIT_MS);
    const unansweredResults: QuizQuestionResult[] = questions
      .slice(currentIndex)
      .map((q) => ({ question: q, selectedIndex: -1 }));
    
    const fullResults = [...questionResults, ...unansweredResults];
    const userCorrect = fullResults.filter((r) => r.selectedIndex === r.question.correctIndex).length;
    
    let opponentCorrect = 0;
    let opponentTimeMs = 0;
    let name = '';

    if (battleMode && opponentName) {
      const opp = generateOpponentScore(userCorrect, questions.length);
      opponentCorrect = opp.correct;
      opponentTimeMs = opp.timeMs;
      name = opponentName;
    }

    navigation.replace('BattleResult', {
      topicId,
      userCorrect,
      userTimeMs: timeMs,
      opponentCorrect,
      opponentTimeMs,
      opponentName: name,
      questionResults: fullResults,
      wagerAmount,
    });
  }, [elapsed, currentIndex, questionResults, questions, battleMode, opponentName, navigation, topicId, wagerAmount]);

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

      <Text style={styles.question}>{question.question}</Text>

      <View style={styles.options}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.option, selectedIndex === index && styles.optionSelected]}
            onPress={() => handleAnswer(index)}
            disabled={answered}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>{option}</Text>
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
});