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
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { theme } from '../theme';
import { globalStyles } from '../styles/globalStyles';
import { RootStackParamList } from '../navigation/types';
import type { Opponent } from '../data/opponents';
import { fetchOpponents } from '../api/opponents';
import { getSavedWager, saveWager } from '../storage/wagerStorage';
import { getWalletBalance } from '../storage/walletStorage';
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
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [wagerAmount, setWagerAmount] = useState(0);
  const [wagerLoaded, setWagerLoaded] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
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

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) getWalletBalance().then(setWalletBalance);
    }, [isLoggedIn])
  );

  const handleToggleFavouriteOpponent = async (id: string) => {
    const next = await toggleFavouriteOpponent(id);
    setFavouriteOpponentIds(next);
  };

  const effectiveWager = useMemo(() => {
    if (!isLoggedIn || wagerAmount <= 0) return 0;
    if (walletBalance !== null && walletBalance < wagerAmount) return 0;
    return wagerAmount;
  }, [isLoggedIn, wagerAmount, walletBalance]);

  const filtered = useMemo(() => {
    const favourites = opponents.filter((o) => favouriteOpponentIds.includes(o.id));
    const q = searchQuery.trim().toLowerCase();
    if (!q) return favourites;
    const searchMatches = opponents.filter((o) => o.name.toLowerCase().includes(q));
    const seen = new Set<string>();
    const result: Opponent[] = [];
    for (const o of [...favourites, ...searchMatches]) {
      if (!seen.has(o.id)) {
        seen.add(o.id);
        result.push(o);
      }
    }
    return result;
  }, [opponents, favouriteOpponentIds, searchQuery]);

  const pickableForAutoPick = filtered.length > 0 ? filtered : opponents;

  const handleSearch = () => {
    const q = searchInput.trim();
    setSearchQuery(q);
    if (q) {
      const hasMatches = opponents.some((o) => o.name.toLowerCase().includes(q.toLowerCase()));
      if (hasMatches) setSearchInput('');
    }
  };

  const handleSelect = (name: string) => {
    const wager = isLoggedIn && effectiveWager > 0 ? effectiveWager : undefined;
    navigation.navigate('Topics', {
      mode: 'battle',
      opponentName: name,
      wagerAmount: wager,
    });
  };

  const handleAutoPick = () => {
    if (!Array.isArray(pickableForAutoPick) || pickableForAutoPick.length === 0) return;
    const names = pickableForAutoPick.map((o) => o.name).filter(Boolean);
    if (names.length === 0) return;
    const wager = isLoggedIn && effectiveWager > 0 ? effectiveWager : undefined;
    navigation.navigate('MatchingOpponent', {
      opponentNames: names,
      wagerAmount: wager,
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
    getWalletBalance().then(setWalletBalance);
    setModalVisible(true);
  };

  const renderOpponentRow = useCallback(
    ({ item: opponent }: { item: Opponent }) => {
      const isFav = favouriteOpponentIds.includes(opponent.id);
      const wagerLabel = opponent.wager !== null ? `$${opponent.wager}` : 'Any';
      return (
        <View style={styles.rowCard}>
          <TouchableOpacity
            style={styles.rowCardMain}
            onPress={() => handleSelect(opponent.name)}
            activeOpacity={0.8}
          >
            <View style={styles.rowCardInfo}>
              <Text style={styles.rowName}>{opponent.name}</Text>
              <Text style={styles.rowRecord}>{formatRecord(opponent.wins, opponent.losses)}</Text>
            </View>
            <Text style={styles.rowWager}>{wagerLabel}</Text>
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
        {searchQuery.trim()
          ? `No match for "${searchQuery}"`
          : 'No favourites yet. Search by name to find opponents, then tap the star to add them to favourites.'}
      </Text>
    ),
    [searchQuery]
  );

  return (
    <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}>
      <Text style={globalStyles.screenTitle}>Choose opponent</Text>

      {battleAgainOpponentName ? (
        <TouchableOpacity
          style={styles.battleAgainCard}
          onPress={() => {
            const wager = isLoggedIn && effectiveWager > 0 ? effectiveWager : undefined;
            navigation.navigate('MatchingOpponent', {
              opponentNames: [battleAgainOpponentName],
              wagerAmount: wager,
              startInWaitingPhase: true,
            });
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.battleAgainLabel}>Battle <Text style={styles.battleAgainName}>{battleAgainOpponentName}</Text> again</Text>
        </TouchableOpacity>
      ) : null}

      <View style={styles.wagerDisplayRow}>
        <View style={styles.wagerSpacer} />
        <View style={styles.wagerCenterSection}>
          <Text style={styles.wagerLabel}>Wager</Text>
          <TouchableOpacity
            style={[
              styles.wagerChip,
              styles.wagerChipDisplay,
              isLoggedIn && effectiveWager > 0 && styles.wagerChipSelected,
              !isLoggedIn && styles.wagerChipDisabled,
            ]}
            onPress={openWagerModal}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.wagerChipText,
                isLoggedIn && effectiveWager > 0 && styles.wagerChipTextSelected,
                !isLoggedIn && styles.wagerChipTextDisabled,
              ]}
            >
              {!isLoggedIn ? 'Log in to wager' : wagerLoaded ? (effectiveWager === 0 ? 'None' : `$${effectiveWager}`) : '...'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.wagerSpacer}>
          {isLoggedIn && (
            <View style={styles.balanceChip}>
              <Text style={styles.balanceLabel}>Balance</Text>
              <Text style={styles.balanceAmount}>
                {walletBalance !== null ? `$${walletBalance.toFixed(2)}` : '...'}
              </Text>
            </View>
          )}
        </View>
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

      <View style={styles.searchRow}>
        <TextInput
          style={[globalStyles.searchInput, styles.searchInputFlex]}
          placeholder="Search by name..."
          placeholderTextColor={theme.colors.textMuted}
          value={searchInput}
          onChangeText={setSearchInput}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[globalStyles.smallButton, styles.searchButton]}
          onPress={handleSearch}
          activeOpacity={0.8}
        >
          <Ionicons name="search" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={globalStyles.mutedText}>Loading opponents...</Text>
      ) : error ? (
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={[globalStyles.smallButton, styles.retryButton]} onPress={loadOpponents} activeOpacity={0.8}>
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
              {WAGER_OPTIONS.map((amount) => {
                const exceedsBalance = amount > 0 && walletBalance !== null && amount > walletBalance;
                return (
                  <TouchableOpacity
                    key={amount}
                    style={[
                      styles.wagerChip,
                      wagerAmount === amount && styles.wagerChipSelected,
                      exceedsBalance && styles.wagerChipDisabled,
                    ]}
                    onPress={() => !exceedsBalance && handleWagerSelect(amount)}
                    activeOpacity={0.8}
                    disabled={exceedsBalance}
                  >
                    <Text
                      style={[
                        styles.wagerChipText,
                        wagerAmount === amount && styles.wagerChipTextSelected,
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
    color: 'rgba(255, 255, 255, 0.9)',
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
  wagerChipDisplay: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  searchInputFlex: {
    flex: 1,
    marginBottom: 0,
  },
  searchButton: {
    flexShrink: 0,
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCardInfo: {
    flex: 1,
  },
  rowWager: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
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