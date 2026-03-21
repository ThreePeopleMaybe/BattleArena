import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
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
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation/types';
import { createArena, getArenasForUser, type Arena } from '../../storage/arenaStorage';
import { globalStyles } from '../../styles/globalStyles';
import { theme } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ArenaHome'>;
};

function formatDate(ms: number): string {
  const d = new Date(ms);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return `Today ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  
  return d.toLocaleDateString();
}

export default function ArenaHomeScreen({ navigation }: Props) {
  const { user, isLoggedIn } = useAuth();
  const [arenas, setArenas] = useState<Arena[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creatingArena, setCreatingArena] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [arenaName, setArenaName] = useState('');
  const [arenaNameError, setArenaNameError] = useState('');

  const loadArenas = useCallback(async () => {
    if (!isLoggedIn || !user?.email) {
      setArenas([]);
      setLoading(false);
      return;
    }
    const list = await getArenasForUser(user.email);
    setArenas(list.sort((a, b) => b.createdAt - a.createdAt));
  }, [isLoggedIn, user?.email]);

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
    setArenaNameError('');
    setCreateModalVisible(true);
  };

  const handleCreateArena = async () => {
    const trimmed = arenaName.trim();
    if (!trimmed) {
      setArenaNameError('Enter an arena name.');
      return;
    }
    setArenaNameError('');
    setCreatingArena(true);
    try {
      const arena = await createArena(trimmed, user?.email);
      setCreateModalVisible(false);
      navigation.navigate('ArenaLobby', { arenaId: arena.id, isHost: true });
    } finally {
      setCreatingArena(false);
    }
  };

  const handleJoinArena = () => {
    if (!isLoggedIn) {
      navigation.navigate('Login');
      return;
    }
    navigation.navigate('JoinArena');
  };

  const isHost = (arena: Arena) => 
    Boolean(
      user?.email &&
      arena.createdByUserId &&
      arena.createdByUserId.trim().toLowerCase() === user.email.trim().toLowerCase()
    );

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
            <Text style={styles.actionIcon}>🏗️</Text>
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

      <Text style={styles.sectionTitle}>My arenas</Text>

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
            onPress={() => navigation.navigate('ArenaLobby', { arenaId: arena.id, isHost: isHost(arena) })}
            activeOpacity={0.8}
          >
            <View style={styles.arenaCardMain}>
              <View style={styles.arenaCardInfo}>
                <Text style={styles.arenaName}>{arena.name}</Text>
                <Text style={styles.arenaMeta}>
                  {arena.joinCode} • {arena.members.length} player{arena.members.length !== 1 ? 's' : ''}
                  {isHost(arena) && ' • Host'}
                </Text>
                <Text style={styles.arenaDate}>{formatDate(arena.createdAt)}</Text>
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
  },
  arenaCardInfo: {
    flex: 1,
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
  modalButtons: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});