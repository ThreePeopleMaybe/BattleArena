import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { createArena, getArenasByUser } from '../../api/arena';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation/types';
import { getWalletBalance } from '../../storage/walletStorage';
import { globalStyles } from '../../styles/globalStyles';
import { theme } from '../../theme';
import type { Arena } from '../../types';

const WAGER_PRESETS = [0, 1, 5, 10, 25] as const;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ArenaHome'>;
  route: RouteProp<RootStackParamList, 'ArenaHome'>;
};

export default function ArenaHomeScreen({ navigation, route }: Props) {
  const gameTypeId = route.params?.gameTypeId ?? 0;
  const { user, isLoggedIn } = useAuth();
  const [arenas, setArenas] = useState<Arena[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creatingArena, setCreatingArena] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [arenaName, setArenaName] = useState('');
  const [arenaWager, setArenaWager] = useState(0);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [arenaNameError, setArenaNameError] = useState('');

  const loadArenas = useCallback(async () => {
    if (!isLoggedIn || user?.userId == null) {
      setArenas([]);
      setLoading(false);
      return;
    }
    const list = await getArenasByUser(user.userId, gameTypeId);
    setArenas(list);
  }, [isLoggedIn, user?.userId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadArenas().finally(() => setLoading(false));
    }, [loadArenas])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadArenas();
    setRefreshing(false);
  }, [loadArenas]);

  const openCreateModal = () => {
    if (!isLoggedIn) {
      navigation.navigate('Login');
      return;
    }
    setArenaName('');
    setArenaWager(0);
    setArenaNameError('');
    setCreateModalVisible(true);
  };

  useEffect(() => {
    if (createModalVisible && isLoggedIn) {
      getWalletBalance().then(setWalletBalance);
    }
  }, [createModalVisible, isLoggedIn]);

  const handleCreateArena = async () => {
    const trimmed = arenaName.trim();
    if (!trimmed) {
      setArenaNameError('Enter an arena name.');
      return;
    }
    if (user?.userId == null) {
      setArenaNameError('Sign in again so your account can create an arena.');
      return;
    }
    setArenaNameError('');
    setCreatingArena(true);
    try {
      const dto = await createArena(trimmed, user.userId, arenaWager, gameTypeId);
      const created: Arena = {
        ...dto,
        members: Array.isArray(dto.members) ? dto.members : [],
      };
      setArenas((prev) => {
        const rest = prev.filter((a) => a.id !== created.id);
        return [created, ...rest];
      });
      setCreateModalVisible(false);
    } catch (e) {
      setArenaNameError(e instanceof Error ? e.message : 'Could not create arena.');
    } finally {
      setCreatingArena(false);
    }
  };

  const handleJoinArena = () => {
    if (!isLoggedIn) {
      navigation.navigate('Login');
      return;
    }
    navigation.navigate('JoinArena', { gameTypeId });
  };

  const isHost = (arena: Arena) => {
    return Boolean(
      user?.userId != null && Number(arena.arenaOwner) === Number(user.userId)
    );
  };

  return (
    <ScrollView
      style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
      }
    >
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionCard, styles.createCard, creatingArena && styles.actionCardDisabled]}
          onPress={openCreateModal}
          activeOpacity={0.8}
          disabled={creatingArena}
        >
          {creatingArena ? (
            <ActivityIndicator size="small" color={theme.colors.text} style={styles.actionSpinner} />
          ) : (
            <Text style={styles.actionIcon}>➕</Text>
          )}
          <Text style={styles.actionTitle}>Create Arena</Text>
          <Text style={styles.actionDesc}>Host a new multiplayer session</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, styles.joinCard]}
          onPress={handleJoinArena}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>🔗</Text>
          <Text style={styles.actionTitle}>Join Arena</Text>
          <Text style={styles.actionDesc}>Enter a code to join</Text>
        </TouchableOpacity>
      </View>

      {!isLoggedIn ? (
        <Text style={globalStyles.emptyState}>Create or join an arena.</Text>
      ) : loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : arenas.length === 0 ? (
        <Text style={globalStyles.emptyState}>
          No arenas yet. Create one or join with a code to get started.
        </Text>
      ) : (
        arenas.map((arena) => (
          <TouchableOpacity
            key={arena.id}
            style={styles.arenaCard}
            onPress={() =>
              navigation.navigate('ArenaLobby', {
                arenaId: arena.id,
                gameTypeId: gameTypeId,
                isHost: isHost(arena),
              })
            }
            activeOpacity={0.8}
          >
            <View style={styles.arenaCardMain}>
              <View style={styles.arenaCardInfo}>
                <Text style={styles.arenaName}>{arena.arenaName}</Text>
                <Text style={styles.arenaMeta}>
                  {arena.arenaCode}
                  {arena.wagerAmount > 0 ? ` • $${arena.wagerAmount} wager` : ' • No wager'}
                  {isHost(arena) && ' • Host'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={theme.colors.textMuted} />
            </View>
          </TouchableOpacity>
        ))
      )}

      <Modal
        visible={createModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setCreateModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Arena</Text>
            <Text style={styles.modalLabel}>Arena name</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="e.g. Friday Night Trivia"
              placeholderTextColor={theme.colors.textMuted}
              value={arenaName}
              onChangeText={(t) => {
                setArenaName(t);
                setArenaNameError('');
              }}
              autoFocus
            />
            {arenaNameError ? <Text style={globalStyles.errorText}>{arenaNameError}</Text> : null}

            <Text style={[styles.modalLabel, styles.modalLabelSpaced]}>Wager (for everyone)</Text>
            <View style={styles.wagerChipRow}>
              {WAGER_PRESETS.map((amount) => {
                const exceedsBalance = amount > 0 && walletBalance !== null && amount > walletBalance;
                return (
                  <TouchableOpacity
                    key={amount}
                    style={[
                      styles.wagerChip,
                      arenaWager === amount && styles.wagerChipSelected,
                      exceedsBalance && styles.wagerChipDisabled,
                    ]}
                    onPress={() => {
                      if (exceedsBalance) return;
                      setArenaWager(amount);
                      setArenaNameError('');
                    }}
                    activeOpacity={0.8}
                    disabled={exceedsBalance}
                  >
                    <Text
                      style={[
                        styles.wagerChipText,
                        arenaWager === amount && styles.wagerChipTextSelected,
                        exceedsBalance && styles.wagerChipTextDisabled,
                      ]}
                    >
                      {amount === 0 ? 'None' : `$${amount}`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[globalStyles.primaryButton, creatingArena && styles.buttonDisabled]}
                onPress={handleCreateArena}
                disabled={creatingArena}
              >
                {creatingArena ? (
                  <ActivityIndicator size="small" color={theme.colors.text} />
                ) : (
                  <Text style={globalStyles.primaryButtonText}>Create</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={globalStyles.cancelButton}
                onPress={() => setCreateModalVisible(false)}
                disabled={creatingArena}
              >
                <Text style={globalStyles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  actionCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  createCard: {
    borderColor: theme.colors.success,
  },
  joinCard: {
    borderColor: theme.colors.primaryLight,
  },
  actionCardDisabled: {
    opacity: 0.7,
  },
  actionIcon: {
    fontSize: 36,
    marginBottom: theme.spacing.sm,
  },
  actionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  actionDesc: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  actionSpinner: {
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
  },
  loadingText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
  arenaCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: theme.colors.surfaceLight,
  },
  arenaCardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  arenaCardInfo: {
    flex: 1,
    minWidth: 0
  },
  arenaName: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  arenaMeta: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  arenaDate: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  modalLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  modalLabelSpaced: {
    marginTop: theme.spacing.md,
  },
  wagerChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  wagerChip: {
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.full,
    borderWidth: 2,
    borderColor: theme.colors.surfaceLight,
  },
  wagerChipSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  wagerChipDisabled: {
    opacity: 0.45,
  },
  wagerChipText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  wagerChipTextSelected: {
    color: theme.colors.primary,
  },
  wagerChipTextDisabled: {
    color: theme.colors.textMuted,
  },
  modalButtons: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});