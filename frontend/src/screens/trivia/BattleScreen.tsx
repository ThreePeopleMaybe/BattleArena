import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { TOPICS } from '../../data/topics';
import { theme } from '../../theme';
import { globalStyles } from '../../styles/globalStyles';
import { RootStackParamList } from '../../navigation/types';

const START_COUNTDOWN_SEC = 5;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Battle'>;
  route: RouteProp<RootStackParamList, 'Battle'>;
};

export default function BattleScreen({ navigation, route }: Props) {
  const { topicId, opponentTopicId, opponentName, wagerAmount } = route.params;
  const [countdown, setCountdown] = useState(START_COUNTDOWN_SEC);
  const started = useRef(false);

  const topic = TOPICS.find((t) => t.id === topicId);
  const opponentTopic = TOPICS.find((t) => t.id === opponentTopicId);

  const startBattle = () => {
    if (started.current) return;
    started.current = true;
    navigation.replace('Quiz', {
      topicId,
      opponentTopicId,
      battleMode: true,
      opponentName,
      wagerAmount: (wagerAmount ?? 0) > 0 ? wagerAmount : undefined,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (countdown > 0) return;
    startBattle();
  }, [countdown]);

  return (
    <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}>
      <Text style={globalStyles.screenTitleLarge}>Battle</Text>
      <View style={styles.topicRow}>
        <View style={[styles.topicBadge, topic && { borderColor: topic.color }]}>
          <Text style={styles.topicIcon}>{topic?.icon}</Text>
          <Text style={styles.topicName}>You: {topic?.name}</Text>
        </View>
        <View style={[styles.topicBadge, opponentTopic && { borderColor: opponentTopic.color }]}>
          <Text style={styles.topicIcon}>{opponentTopic?.icon}</Text>
          <Text style={styles.topicName}>Them: {opponentTopic?.name}</Text>
        </View>
      </View>

      <View style={styles.vsRow}>
        <View style={styles.player}>
          <Text style={styles.playerLabel}>You</Text>
          <Text style={styles.playerName}>You</Text>
        </View>
        <Text style={styles.vs}>VS</Text>
        <View style={styles.player}>
          <Text style={styles.playerLabel}>Opponent</Text>
          <Text style={styles.playerName}>{opponentName}</Text>
        </View>
      </View>
      
      <Text style={styles.rules}>
        Questions from both topics. Most correct answers wins. Tie-breaker: shortest time.
      </Text>

      <View style={styles.countdownWrap}>
        <Text style={styles.countdownLabel}>Starting in</Text>
        <Text style={styles.countdownNumber}>{countdown}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topicRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  topicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.full,
    borderWidth: 2,
  },
  topicIcon: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  topicName: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
  vsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.xl,
  },
  player: {
    alignItems: 'center',
  },
  playerLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  playerName: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.text,
  },
  vs: {
    fontSize: theme.fontSize.lg,
    fontWeight: '800',
    color: theme.colors.accent,
  },
  rules: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  countdownWrap: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  countdownLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  countdownNumber: {
    fontSize: 44,
    fontWeight: '800',
    color: theme.colors.primary,
  },
});