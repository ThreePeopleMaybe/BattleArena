import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../../theme';
import { globalStyles } from '../../styles/globalStyles';
import { RootStackParamList } from '../../navigation/types';
import { getArenaById, updateArenaWager, type Arena } from '../../storage/arenaStorage';
import { getWalletBalance } from '../../storage/walletStorage';
import { useAuth } from '../../context/AuthContext';

const WAGER_PRESETS = [0, 1, 5, 10, 25];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ArenaLobby'>;
  route: RouteProp<RootStackParamList, 'ArenaLobby'>;
};
export default function ArenaLobbyScreen({ navigation, route }: Props) {
  const { arenaId } = route.params;
  const { isLoggedIn } = useAuth();
  
  const [arena, setArena] = useState<Arena | null>(null);
  const [wagerModalVisible, setWagerModalVisible] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const loadArena = useCallback(async () => {
    const a = await getArenaById(arenaId);
    setArena(a ?? null);
  }, [arenaId]);

  const handleSetWager = useCallback(async (amount: number) => {
    await updateArenaWager(arenaId, amount);
    setArena((prev) => prev ? { ...prev, wagerAmount: amount } : null);
    setWagerModalVisible(false);
  }, [arenaId]);

  const openWagerModal = useCallback(() => {
    if (!isLoggedIn) {
      Alert.alert(
        'Log in to wager',
        'You need to log in to set a wager amount for the arena.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log in', onPress: () => navigation.navigate('Login') },
        ]
      );
      return;
    }
    getWalletBalance().then(setWalletBalance);
    setWagerModalVisible(true);
  }, [isLoggedIn, navigation]);

  useFocusEffect(
    useCallback(() => {
      loadArena();
      if (isLoggedIn) getWalletBalance().then(setWalletBalance);
      const interval = setInterval(loadArena, 3000);
      return () => clearInterval(interval);
    }, [loadArena, isLoggedIn])
  );

  if (!arena) {
    return (
      <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}>
        <Text style={styles.loading}>Loading arena...</Text>
      </View>
    );
  }

  return (
    <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}>
      {/* Join Code Section */}
      <View style={styles.joinCodeBox}>
        <Text style={styles.joinCodeLabel}>Arena join code</Text>
        <Text style={styles.joinCodeValue}>{arena.joinCode}</Text>
        <Text style={styles.joinCodeHint}>Share this code so players can join</Text>
      </View>

      {/* Wager Display Section */}
      <View style={styles.wagerDisplayRow}>
        <View style={styles.wagerSpacer} />
        <View style={styles.wagerCenterSection}>
          <Text style={styles.wagerLabel}>Wager</Text>
          <TouchableOpacity
            style={[
              styles.wagerChip,
              styles.wagerChipDisplay,
              arena.wagerAmount > 0 && styles.wagerChipSelected,
              !isLoggedIn && styles.wagerChipDisabled,
            ]}
            onPress={openWagerModal}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.wagerChipText,
                arena.wagerAmount > 0 && styles.wagerChipTextSelected,
                !isLoggedIn && styles.wagerChipTextDisabled,
              ]}
            >
              {!isLoggedIn ? 'Log in to wager' : arena.wagerAmount === 0 ? 'None' : `$${arena.wagerAmount}`}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.wagerSpacer} />
      </View>

      {/* Wager Selection Modal */}
      <Modal
        visible={wagerModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWagerModalVisible(false)}
      >
        <Pressable style={globalStyles.modalOverlay} onPress={() => setWagerModalVisible(false)}>
          <Pressable style={globalStyles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={globalStyles.modalTitle}>Select wager (for everyone)</Text>
            <View style={styles.modalChips}>
              {WAGER_PRESETS.map((amount) => {
                const exceedsBalance = amount > 0 && walletBalance !== null && amount > walletBalance;
                return (
                  <TouchableOpacity
                    key={amount}
                    style={[
                      styles.wagerChip,
                      arena.wagerAmount === amount && styles.wagerChipSelected,
                      exceedsBalance && styles.wagerChipDisabled,
                    ]}
                    onPress={() => !exceedsBalance && handleSetWager(amount)}
                    activeOpacity={0.8}
                    disabled={exceedsBalance}
                  >
                    <Text
                      style={[
                        styles.wagerChipText,
                        arena.wagerAmount === amount && styles.wagerChipTextSelected,
                        exceedsBalance && styles.wagerChipTextDisabled,
                      ]}
                    >
                      {amount === 0 ? 'None' : `$${amount}`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity
              style={globalStyles.primaryButton}
              onPress={() => setWagerModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={globalStyles.primaryButtonText}>Done</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Action Button */}
      <TouchableOpacity
        style={[globalStyles.primaryButton, styles.startButton]}
        onPress={() => navigation.navigate('Topics', { mode: 'battle', fromArena: true, wagerAmount: arena.wagerAmount, arenaId: arena.id })}
        activeOpacity={0.8}
      >
        <Text style={globalStyles.primaryButtonText}>Open Arena</Text>
      </TouchableOpacity>

      {/* Players List */}
      <Text style={styles.membersLabel}>Players ({arena.members.length})</Text>
      <ScrollView style={styles.memberList} contentContainerStyle={styles.memberListContent}>
        {arena.members.map((m) => (
          <View key={m.id} style={styles.memberRow}>
            <Ionicons name="person" size={20} color={theme.colors.primary} />
            <Text style={styles.memberName}>{m.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  joinCodeBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center'
  },
  joinCodeLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  joinCodeValue: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: 6,
  },
  joinCodeHint: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  wagerDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  wagerSpacer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  wagerCenterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wagerLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginRight: theme.spacing.sm,
  },
  wagerChip: {
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.full,
    borderWidth: 2,
    borderColor: theme.colors.surfaceLight,
  },
  wagerChipDisplay: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  wagerChipSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  wagerChipText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  wagerChipTextSelected: {
    color: theme.colors.primary,
  },
  wagerChipDisabled: {
    opacity: 0.8,
  },
  wagerChipTextDisabled: {
    color: theme.colors.textMuted,
  },
  balanceChip: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    borderColor: theme.colors.success,
  },
  balanceLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  balanceAmount: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.success,
  },
  modalChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  startButton: {
    marginBottom: theme.spacing.lg,
  },
  membersLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  memberList: {
    maxHeight: 200,
    marginBottom: theme.spacing.lg,
  },
  memberListContent: {
    paddingBottom: theme.spacing.md,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.surfaceLight,
  },
  memberName: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
});