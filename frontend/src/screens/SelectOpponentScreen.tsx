import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { theme } from '../theme';
import { globalStyles } from '../styles/globalStyles';
import { RootStackParamList } from '../navigation/types';
import type { Opponent } from '../data/opponents';
import { fetchOpponents } from '../api/opponents';
import { getSavedWager, saveWager } from '../storage/wagerStorage';
import { getFavouriteOpponentIds, toggleFavouriteOpponent } from '../storage/favouritesStorage';
import { useAuth } from '../context/AuthContext';

const WAGER_OPTIONS = [0, 1, 5, 10, 25];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SelectOpponent'>;
  route: RouteProp<RootStackParamList, 'SelectOpponent'>;
};

function formatRecord(wins: number, losses: number): string {
  return `${wins}W-${losses}L`;
}

export default function SelectOpponentScreen({ navigation, route }: Props) {
  const { isLoggedIn } = useAuth();
  const battleAgainOpponentName = route.params?.battleAgainOpponentName;
  const [opponents, setOpponents] = useState<Opponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [wagerAmount, setWagerAmount] = useState(0);
  const [wagerLoaded, setWagerLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [favouriteOpponentIds, setFavouriteOpponentIds] = useState<string[]>([]);

  const loadOpponents = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchOpponents();
      setOpponents(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load opponents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOpponents();
  }, [loadOpponents]);

  useEffect(() => {
    getSavedWager().then((saved) => {
      setWagerAmount(saved);
      setWagerLoaded(true);
    });
  }, []);

  useEffect(() => {
    getFavouriteOpponentIds().then(setFavouriteOpponentIds);
  }, []);

  const handleToggleFavouriteOpponent = async (id: string) => {
    const next = await toggleFavouriteOpponent(id);
    setFavouriteOpponentIds(next);
  };

  const pickableForAutoPick = useMemo(() => {
    if (!isLoggedIn) {
      return opponents.filter((o) => o.wager == null || o.wager === undefined);
    }
    return wagerAmount === 0
      ? opponents
      : opponents.filter((o) => o.wager == null || o.wager === wagerAmount);
  }, [opponents, wagerAmount, isLoggedIn]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return pickableForAutoPick.filter((o) => favouriteOpponentIds.includes(o.id));
    }
    return pickableForAutoPick.filter((o) => o.name.toLowerCase() === q);
  }, [pickableForAutoPick, search, favouriteOpponentIds]);

  const handleSelect = (name: string) => {
    const effectiveWager = isLoggedIn && wagerAmount > 0 ? wagerAmount : undefined;
    navigation.navigate('Topics', {
      mode: 'battle',
      opponentName: name,
      wagerAmount: effectiveWager,
    });
  };

  const handleAutoPick = () => {
    if (!Array.isArray(pickableForAutoPick) || pickableForAutoPick.length === 0) return;
    const names = pickableForAutoPick.map((o) => o.name).filter(Boolean);
    if (names.length === 0) return;
    const effectiveWager = isLoggedIn && wagerAmount > 0 ? wagerAmount : undefined;
    navigation.navigate('MatchingOpponent', {
      opponentNames: names,
      wagerAmount: effectiveWager,
    });
  };

  const handleWagerSelect = (amount: number) => {
    if (!isLoggedIn) return;
    setWagerAmount(amount);
    saveWager(amount);
    setModalVisible(false);
  };

  const openWagerModal = () => {
    if (!isLoggedIn) {
      Alert.alert(
        'Log in to wager',
        'You need to log in to set a wager amount and battle for money.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log in', onPress: () => navigation.navigate('Login') },
        ]
      );
      return;
    }
    setModalVisible(true);
  };

  const renderOpponentRow = useCallback(
    ({ item: opponent }: { item: Opponent }) => {
      const isFav = favouriteOpponentIds.includes(opponent.id);
      return (
        <View style={styles.rowCard}>
          <TouchableOpacity
            style={styles.rowCardMain}
            onPress={() => handleSelect(opponent.name)}
            activeOpacity={0.8}
          >
            <Text style={styles.rowName}>{opponent.name}</Text>
            <Text style={styles.rowRecord}>{formatRecord(opponent.wins, opponent.losses)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favButton}
            onPress={() => handleToggleFavouriteOpponent(opponent.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isFav ? 'star' : 'star-outline'}
              size={22}
              color={isFav ? theme.colors.primary : theme.colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      );
    },
    [favouriteOpponentIds]
  );

  const keyExtractor = useCallback((item: Opponent) => item.id, []);

  const listEmptyComponent = useCallback(
    () => (
      <Text style={globalStyles.emptyState}>
        {!search.trim()
          ? favouriteOpponentIds.length === 0
            ? 'No favourites yet. Search by name to find opponents, then tap the star to add them to favourites.'
            : 'No favourites match your current wager.'
          : `No match for "${search}"`}
      </Text>
    ),
    [favouriteOpponentIds.length, search]
  );

  return (
    <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}>
      <Text style={globalStyles.screenTitle}>Choose opponent</Text>

      {battleAgainOpponentName ? (
        <TouchableOpacity
          style={styles.battleAgainCard}
          onPress={() => {
            const effectiveWager = isLoggedIn && wagerAmount > 0 ? wagerAmount : undefined;
            navigation.navigate('MatchingOpponent', {
              opponentNames: [battleAgainOpponentName],
              wagerAmount: effectiveWager,
              startInWaitingPhase: true,
            });
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.battleAgainLabel}>
            Battle <Text style={styles.battleAgainName}>{battleAgainOpponentName}</Text> again
          </Text>
        </TouchableOpacity>
      ) : null}

      <View style={styles.wagerDisplayRow}>
        <Text style={styles.wagerLabel}>Current wager</Text>
        <TouchableOpacity
          style={[
            styles.wagerChip,
            styles.wagerChipDisplay,
            isLoggedIn && wagerAmount > 0 && styles.wagerChipSelected,
            !isLoggedIn && styles.wagerChipDisabled,
          ]}
          onPress={openWagerModal}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.wagerChipText,
              isLoggedIn && wagerAmount > 0 && styles.wagerChipTextSelected,
              !isLoggedIn && styles.wagerChipTextDisabled,
            ]}
          >
            {!isLoggedIn
              ? 'Log in to wager'
              : wagerLoaded ? (wagerAmount === 0 ? 'None' : `$${wagerAmount}`) : '...'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.autoPickRow}>
        <TouchableOpacity
          style={[globalStyles.smallButton, styles.autoPickButtonFlex]}
          onPress={handleAutoPick}
          activeOpacity={0.8}
        >
          <Text style={[globalStyles.smallButtonText]}>
            🎲 Auto pick opponent
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={globalStyles.searchInput}
        placeholder="Search by name..."
        placeholderTextColor={theme.colors.textMuted}
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {loading ? (
        <Text style={globalStyles.mutedText}>Loading opponents...</Text>
      ) : error ? (
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={[globalStyles.smallButton, styles.retryButton]} 
            onPress={loadOpponents} 
            activeOpacity={0.8}
          >
            <Text style={globalStyles.smallButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={keyExtractor}
          renderItem={renderOpponentRow}
          ListEmptyComponent={listEmptyComponent}
          contentContainerStyle={filtered.length === 0 ? styles.listEmpty : styles.list}
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
          initialNumToRender={15}
          maxToRenderPerBatch={20}
          windowSize={11}
          removeClippedSubviews={true}
        />
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={globalStyles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={globalStyles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={globalStyles.modalTitle}>Select wager amount</Text>
            <View style={styles.modalChips}>
              {WAGER_OPTIONS.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[styles.wagerChip, wagerAmount === amount && styles.wagerChipSelected]}
                  onPress={() => handleWagerSelect(amount)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.wagerChipText,
                      wagerAmount === amount && styles.wagerChipTextSelected,
                    ]}
                  >
                    {amount === 0 ? 'None' : `$${amount}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={globalStyles.primaryButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={globalStyles.primaryButtonText}>Done</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wagerLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginRight: theme.spacing.sm,
  },
  battleAgainCard: {
    backgroundColor: '#15803d',
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(21, 128, 61, 0.7)',
  },
  battleAgainLabel: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: theme.spacing.xs,
  },
  battleAgainName: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.text,
  },
  wagerDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  wagerChipDisplay: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  autoPickRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  autoPickButtonFlex: {
    flex: 1,
  },
  autoPickButtonDisabled: {
    opacity: 0.5,
  },
  autoPickButtonTextDisabled: {
    color: theme.colors.textMuted,
  },
  listContainer: {
    flex: 1,
  },
  list: {
    paddingBottom: theme.spacing.lg,
  },
  listEmpty: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  rowCardMain: {
    flex: 1,
  },
  favButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  rowName: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  rowRecord: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  errorWrap: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.accent,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: theme.spacing.xs,
  },
  modalChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
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
});