import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getArenaById, leaveArena } from '../../api/arena';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation/types';
import { globalStyles } from '../../styles/globalStyles';
import { theme } from '../../theme';
import type { Arena, ArenaMember } from '../../types';

type LobbyPlayerRow = ArenaMember & { isHost: boolean };

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ArenaLobby'>;
  route: RouteProp<RootStackParamList, 'ArenaLobby'>;
};

function buildLobbyPlayers(arena: Arena, currentUserId?: number, currentUsername?: string): LobbyPlayerRow[] {
  const ownerId = Number(arena.arenaOwner);
  const map = new Map<number, LobbyPlayerRow>();

  for (const m of arena.members) {
    const id = Number(m.userId);
    if (!Number.isFinite(id)) continue;
    map.set(id, {
      userId: id,
      userName: m.userName,
      isHost: id === ownerId,
    });
  }

  if (Number.isFinite(ownerId) && !map.has(ownerId)) {
    const nameFromSelf =
      currentUserId != null && Number(currentUserId) === ownerId && currentUsername?.trim()
        ? currentUsername.trim()
        : 'Host';
    map.set(ownerId, {
      userId: ownerId,
      userName: nameFromSelf,
      isHost: true,
    });
  } else {
    for (const row of map.values()) {
      if (Number(row.userId) === ownerId) row.isHost = true;
    }
  }

  const list = [...map.values()];
  list.sort((a, b) => {
    if (a.isHost !== b.isHost) return a.isHost ? -1 : 1;
    return a.userName.localeCompare(b.userName, undefined, { sensitivity: 'base' });
  });
  return list;
}

export default function ArenaLobbyScreen({ navigation, route }: Props) {
  const { arenaId, isHost: isHostParam } = route.params;
  const { isLoggedIn, user } = useAuth();

  const [arena, setArena] = useState<Arena | null>(null);

  const loadArena = useCallback(async () => {
    try {
      const a = await getArenaById(arenaId);
      setArena(a ?? null);
    } catch {
      setArena(null);
    }
  }, [arenaId]);

  useFocusEffect(
    useCallback(() => {
      loadArena();
      const interval = setInterval(loadArena, 3000);
      return () => clearInterval(interval);
    }, [loadArena])
  );

  const lobbyPlayers = useMemo(
    () => (arena ? buildLobbyPlayers(arena, user?.userId, user?.username) : []),
    [arena, user?.userId, user?.username]
  );

  if (!arena) {
    return (
      <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}>
        <Text style={styles.loading}>Loading arena...</Text>
      </View>
    );
  }

  const isHostEffective =
    isLoggedIn &&
    (isHostParam === true || (user?.userId != null && arena.arenaOwner === user.userId));

  const isHost = isLoggedIn && isHostEffective;

  const confirmDeleteArena = () => {
    Alert.alert('Delete arena?', 'This removes the arena for everyone. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          navigation.navigate('ArenaHome');
        },
      },
    ]);
  };

  const confirmLeaveArena = () => {
    Alert.alert(
      'Leave arena?',
      'You will be removed from this arena. You can rejoin with the code later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            const uid = user?.userId;
            const n = Number(arenaId);
            if (uid != null && Number.isFinite(n) && n === arenaId) {
              try {
                await leaveArena(n, uid);
              } catch {
                /* still navigate */
              }
            }
            navigation.navigate('ArenaHome');
          },
        },
      ]
    );
  };

  return (
    <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}>
      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.mainScrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.joinCodeBox}>
          <Text style={styles.joinCodeLabel}>Arena join code</Text>
          <Text style={styles.joinCodeValue}>{arena.arenaCode}</Text>
          <Text style={styles.joinCodeHint}>Share this code so players can join</Text>
        </View>

        <View style={styles.wagerDisplayRow}>
          <View style={styles.wagerSpacer} />
          <View style={styles.wagerCenterSection}>
            <Text style={styles.wagerLabel}>{!isLoggedIn ? '' : 'Wager'}</Text>
            <View style={[styles.wagerChip, styles.wagerChipDisplay, styles.wagerChipReadOnly]}>
              <Text style={[styles.wagerChipText, styles.wagerChipTextReadOnly]}>
                {arena.wagerAmount === 0 ? 'None' : `$${arena.wagerAmount}`}
              </Text>
            </View>
          </View>
          <View style={styles.wagerSpacer}>
            {isHost ? (
              <TouchableOpacity
                style={styles.dangerButton}
                onPress={confirmDeleteArena}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
                <Text style={styles.dangerButtonText}>Delete arena</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.leaveRowButton}
                onPress={confirmLeaveArena}
                activeOpacity={0.8}
              >
                <Ionicons name="exit-outline" size={18} color={theme.colors.textMuted} />
                <Text style={styles.leaveButtonText}>Leave arena</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[globalStyles.secondaryButton, styles.arenaChallengesButton]}
          onPress={() => navigation.navigate('Challenge', { arenaId: arena.id })}
          activeOpacity={0.8}
        >
          <Text style={globalStyles.secondaryButtonText}>Arena challenges</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.secondaryButton, styles.arenaLeaderboardButton]}
          onPress={() => navigation.navigate('ArenaLeaderboard', { arenaId: arena.id })}
          activeOpacity={0.8}
        >
          <Ionicons name="trophy-outline" size={20} color={theme.colors.primary} />
          <Text style={globalStyles.secondaryButtonText}>Arena leaderboard</Text>
        </TouchableOpacity>

        <Text style={styles.membersLabel}>Players ({lobbyPlayers.length})</Text>
        <View style={styles.memberList}>
          {lobbyPlayers.map((m) => (
            <View key={m.userId} style={styles.memberRow}>
              <Ionicons name="person" size={20} color={theme.colors.primary} />
              <Text style={styles.memberName}>{m.userName}</Text>
              {m.isHost ? (
                <View style={styles.hostBadge}>
                  <Text style={styles.hostBadgeText}>Host</Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainScroll: { flex: 1 },
  mainScrollContent: { paddingBottom: theme.spacing.lg },
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
    alignItems: 'center',
  },
  joinCodeLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
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
  wagerCenterSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
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
  wagerChipReadOnly: {
    opacity: 0.75,
    borderColor: theme.colors.surfaceLight,
    backgroundColor: theme.colors.background,
  },
  wagerChipText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  wagerChipTextReadOnly: { color: theme.colors.textMuted },
  arenaChallengesButton: { marginBottom: theme.spacing.lg, width: '100%' },
  arenaLeaderboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    width: '100%',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.surfaceLight,
    backgroundColor: theme.colors.surface,
  },
  dangerButtonText: { fontSize: theme.fontSize.sm, fontWeight: '600', color: theme.colors.error },
  leaveRowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.surfaceLight,
    backgroundColor: theme.colors.surface,
  },
  leaveButtonText: { fontSize: theme.fontSize.sm, fontWeight: '600', color: theme.colors.textMuted },
  membersLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  memberList: { marginBottom: theme.spacing.lg },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.surfaceLight,
    gap: theme.spacing.sm,
  },
  memberName: { flex: 1, minWidth: 0, fontSize: theme.fontSize.md, fontWeight: '600', color: theme.colors.text },
  hostBadge: {
    paddingVertical: 2,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.5)',
  },
  hostBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primaryLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});