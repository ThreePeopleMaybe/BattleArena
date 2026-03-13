import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { theme } from '../../theme';
import { globalStyles } from '../../styles/globalStyles';
import { RootStackParamList } from '../../navigation/types';

const START_COUNTDOWN_SEC = 5;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Battle'>;
  route: RouteProp<RootStackParamList, 'Battle'>;
};

export default function BattleScreen({ navigation, route }: Props) {
  const { topicId, opponentTopicId, opponentName, wagerAmount, arenaId } = route.params;
  const [countdown, setCountdown] = useState(START_COUNTDOWN_SEC);
  const started = useRef(false);

  const startBattle = () => {
    if (started.current) return;
    started.current = true;
    navigation.replace('Quiz', {
      topicId,
      opponentTopicId,
      battleMode: true,
      opponentName,
      wagerAmount: (wagerAmount ?? 0) > 0 ? wagerAmount : undefined,
      arenaId,
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
    <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding, styles.container]}>
      <View style={styles.countdownWrap}>
        <Text style={styles.countdownLabel}>Starting in</Text>
        <Text style={styles.countdownNumber}>{countdown}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  countdownWrap: {
    alignItems: 'center',
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