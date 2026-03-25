import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MatchingOpponent'>;
  route: RouteProp<RootStackParamList, 'MatchingOpponent'>;
};

const MATCHING_DURATION_MS = 2800;
const OPPONENT_ACCEPT_SIMULATED_MS = 4000;
const LONGER_THAN_USUAL_MS = 5000;

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function MatchingOpponentScreen({ navigation, route }: Props) {
  const { opponentNames, wagerAmount, startInWaitingPhase } = route.params;
  const [currentOpponent, setCurrentOpponent] = useState<string>(() => 
    opponentNames.length > 0 ? (startInWaitingPhase ? opponentNames[0] : pickRandom(opponentNames)) : ''
  );

  const pulseAnim = useRef(new Animated.Value(0)).current;
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;

  const [phase, setPhase] = useState<'matching' | 'found' | 'waitingForOpponent'>(
    startInWaitingPhase && opponentNames.length > 0 ? 'waitingForOpponent' : 'matching'
  );
  const [takingLonger, setTakingLonger] = useState(false);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1200, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  useEffect(() => {
    const runRing = (anim: Animated.Value, delay: number) => 
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 2000, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
          Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );

    const r1 = runRing(ring1, 0);
    const r2 = runRing(ring2, 400);
    const r3 = runRing(ring3, 800);

    r1.start(); r2.start(); r3.start();
    return () => { r1.stop(); r2.stop(); r3.stop(); };
  }, [ring1, ring2, ring3]);

  useEffect(() => {
    if (phase !== 'matching') return;
    const matchTimer = setTimeout(() => setPhase('found'), MATCHING_DURATION_MS);
    return () => clearTimeout(matchTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'matching' && phase !== 'waitingForOpponent') {
      setTakingLonger(false);
      return;
    }
    const longerTimer = setTimeout(() => setTakingLonger(true), LONGER_THAN_USUAL_MS);
    return () => clearTimeout(longerTimer);
  }, [phase]);

  const handleAccept = () => setPhase('waitingForOpponent');

  useEffect(() => {
    if (phase !== 'waitingForOpponent') return;
    const timer = setTimeout(() => {
      navigation.replace('Topics', { mode: 'battle', opponentName: currentOpponent, wagerAmount });
    }, OPPONENT_ACCEPT_SIMULATED_MS);
    return () => clearTimeout(timer);
  }, [phase, currentOpponent, wagerAmount, navigation]);

  const handleCancel = () => navigation.goBack();

  const pulseOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });
  const ring1Scale = ring1.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.4] });
  const ring1Opacity = ring1.interpolate({ inputRange: [0, 0.8, 1], outputRange: [0.5, 0.2, 0] });
  const ring2Scale = ring2.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.4] });
  const ring2Opacity = ring2.interpolate({ inputRange: [0, 0.8, 1], outputRange: [0.5, 0.2, 0] });
  const ring3Scale = ring3.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.4] });
  const ring3Opacity = ring3.interpolate({ inputRange: [0, 0.8, 1], outputRange: [0.5, 0.2, 0] });

  const showMatchingUi = phase === 'matching' || phase === 'found';
  const showWaitingUi = phase === 'waitingForOpponent';

  return (
    <View style={[globalStyles.screenContainer, styles.containerCentered]}>
      {showMatchingUi && (
        <>
          <View style={styles.center}>
            <Animated.View style={[styles.ring, { transform: [{ scale: ring1Scale }], opacity: ring1Opacity }]} />
            <Animated.View style={[styles.ring, { transform: [{ scale: ring2Scale }], opacity: ring2Opacity }]} />
            <Animated.View style={[styles.ring, { transform: [{ scale: ring3Scale }], opacity: ring3Opacity }]} />
            <Animated.View style={[styles.dot, { opacity: pulseOpacity }]} />
          </View>
          <Text style={[globalStyles.screenTitle, styles.titleCenter]}>
            {phase === 'matching' ? 'Finding you an opponent...' : 'Match found!'}
          </Text>
          <Text style={[globalStyles.screenSubtitle, styles.subtitleCenter]}>
            {phase === 'matching' ? 'Searching for the best match' : `You'll battle ${currentOpponent}`}
          </Text>
          {takingLonger && phase === 'matching' && (
            <Text style={styles.patientText}>This is taking longer than usual. Please be patient.</Text>
          )}
          {phase === 'matching' && (
            <TouchableOpacity style={globalStyles.cancelButton} onPress={handleCancel} activeOpacity={0.8}>
              <Text style={globalStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
          {phase === 'found' && (
            <View style={styles.foundActions}>
              <TouchableOpacity style={[styles.actionButton, globalStyles.primaryButton]} onPress={handleAccept} activeOpacity={0.8}>
                <Text style={globalStyles.primaryButtonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={globalStyles.cancelButton} onPress={handleCancel} activeOpacity={0.8}>
                <Text style={globalStyles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
      {showWaitingUi && (
        <>
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.spinner} />
          <Text style={[globalStyles.screenTitle, styles.titleCenter]}>Waiting for opponent to accept</Text>
          <Text style={[globalStyles.screenSubtitle, styles.subtitleCenter]}>{currentOpponent} hasn't accepted yet.</Text>
          {takingLonger && <Text style={styles.patientText}>This is taking longer than usual. Please be patient.</Text>}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerCentered: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: theme.spacing.xl },
  titleCenter: { textAlign: 'center' },
  subtitleCenter: { textAlign: 'center' },
  center: { width: 160, height: 160, justifyContent: 'center', alignItems: 'center', marginBottom: theme.spacing.xl },
  ring: { position: 'absolute', width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: theme.colors.primary },
  dot: { width: 24, height: 24, borderRadius: 12, backgroundColor: theme.colors.primary },
  patientText: { fontSize: theme.fontSize.sm, color: theme.colors.textMuted, textAlign: 'center', fontStyle: 'italic', marginTop: theme.spacing.md, paddingHorizontal: theme.spacing.lg },
  foundActions: { marginTop: theme.spacing.xl, width: '100%', maxWidth: 280, alignItems: 'center', gap: theme.spacing.sm },
  actionButton: { width: '100%' },
  spinner: { marginBottom: theme.spacing.lg },
});