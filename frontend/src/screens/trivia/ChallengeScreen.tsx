import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { QuestionTopicDto } from '../../api/questionTopics';
import { getActiveTriviaGame } from '../../api/triviaGame';
import { useAuth } from '../../context/AuthContext';
import { useQuestionTopics } from '../../hooks/useQuestionTopics';
import { RootStackParamList } from '../../navigation/types';
import { getFavouriteTopicIds, toggleFavouriteTopic } from '../../storage/favouritesStorage';
import { getSavedWager, saveWager } from '../../storage/wagerStorage';
import { getWalletBalance } from '../../storage/walletStorage';
import { globalStyles } from '../../styles/globalStyles';
import { triviaTopicStyles } from '../../styles/triviaTopicStyles';
import { theme } from '../../theme';
import { ActiveTriviaGame } from '../../types';
import { topicAccentColorForId } from './shared/topicList';

const ALL_WAGERS = -1;
const WAGER_OPTIONS: { value: number; label: string }[] = [
  { value: ALL_WAGERS, label: 'All wagers' },
  { value: 0, label: 'None' },
  { value: 1, label: '$1' },
  { value: 5, label: '$5' },
  { value: 10, label: '$10' },
  { value: 25, label: '$25' },
];

const ALL_TOPICS = 'all';

interface TopicOption {
  id: string;
  name: string;
}

function entryMatchesTopic(entry: ActiveTriviaGame, topic: QuestionTopicDto): boolean {
  if (entry.topicId === topic.id) return true;
  const a = entry.topicName.trim().toLowerCase();
  const b = topic.name.trim().toLowerCase();
  return a.length > 0 && a === b;
}

function pickRandomTopic(topics: QuestionTopicDto[]): QuestionTopicDto {
  return topics[Math.floor(Math.random() * topics.length)];
}

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Challenge'>;
};

export default function ChallengeScreen({ navigation }: Props) {
  const { isLoggedIn, user } = useAuth();
  const [activeTriviaGames, setActiveTriviaGames] = useState<ActiveTriviaGame[]>([]);
  const [activeTriviaGamesLoading, setActiveTriviaGamesLoading] = useState(false);
  const [activeTriviaGamesError, setActiveTriviaGamesError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(ALL_TOPICS);
  const [topicFilterModalVisible, setTopicFilterModalVisible] = useState(false);
  const [topicSearch, setTopicSearch] = useState('');
  const { topics: apiTopics, loading: topicsLoading, reload: loadTopics } = useQuestionTopics();
  const [favouriteTopicIds, setFavouriteTopicIds] = useState<number[]>([]);
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [wagerAmount, setWagerAmount] = useState(ALL_WAGERS);
  const [wagerLoaded, setWagerLoaded] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [wagerModalVisible, setWagerModalVisible] = useState(false);

  const loadActiveTriviaGames = useCallback(async () => {
    const userId = user?.userId;
    if (userId == null) {
      setActiveTriviaGames([]);
      setActiveTriviaGamesError(null);
      return;
    }
    setActiveTriviaGamesLoading(true);
    setActiveTriviaGamesError(null);
    try {
      const rows = await getActiveTriviaGame(userId);
      const displayName = user?.username?.trim() || 'You';
      setActiveTriviaGames(rows);
    } catch {
      setActiveTriviaGames([]);
      setActiveTriviaGamesError('Could not load active trivia games.');
    } finally {
      setActiveTriviaGamesLoading(false);
    }
  }, [user?.userId, user?.username]);

  useEffect(() => {
    if (topicsLoading) return;
    if (selectedTopicId === ALL_TOPICS) return;
    if (!apiTopics.some((t) => String(t.id) === selectedTopicId)) {
      setSelectedTopicId(ALL_TOPICS);
    }
  }, [apiTopics, topicsLoading, selectedTopicId]);

  useEffect(() => {
    getSavedWager().then((saved) => {
      setWagerAmount(saved >= -1 ? saved : 0);
      setWagerLoaded(true);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) getWalletBalance().then(setWalletBalance);
    }, [isLoggedIn])
  );

  useFocusEffect(
    useCallback(() => {
      loadActiveTriviaGames();
      loadTopics();
      getFavouriteTopicIds().then(setFavouriteTopicIds);
    }, [loadActiveTriviaGames, loadTopics])
  );

  const handleToggleFavouriteTopic = useCallback(async (id: number) => {
    const next = await toggleFavouriteTopic(id);
    setFavouriteTopicIds(next);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadActiveTriviaGames(), loadTopics()]);
    setRefreshing(false);
  }, [loadActiveTriviaGames, loadTopics]);

  const filteredActiveTriviaGames = useMemo(() => {
    let result = activeTriviaGames;
    if (!isLoggedIn) {
      result = result.filter((e) => (e.wagerAmount ?? 0) === 0);
    }
    if (selectedTopicId !== ALL_TOPICS) {
      const topic = apiTopics.find((t) => String(t.id) === selectedTopicId);
      if (topic) {
        result = result.filter((e) => entryMatchesTopic(e, topic));
      }
    }
    if (wagerAmount !== ALL_WAGERS) {
      result = result.filter((e) => (e.wagerAmount ?? 0) === wagerAmount);
    }
    return result;
  }, [activeTriviaGames, selectedTopicId, wagerAmount, isLoggedIn, apiTopics]);

  const topicOptions: TopicOption[] = useMemo(() => {
    const all: TopicOption = { id: ALL_TOPICS, name: 'Any topics' };
    let topicOpts = apiTopics.map((t) => ({ id: String(t.id), name: t.name }));
    if (showFavouritesOnly) {
      topicOpts = topicOpts.filter((t) => favouriteTopicIds.includes(Number(t.id)));
    }
    const list = [all, ...topicOpts];
    const q = topicSearch.trim().toLowerCase();
    if (!q) return list;
    return list.filter((t) => t.name.toLowerCase().includes(q));
  }, [topicSearch, apiTopics, showFavouritesOnly, favouriteTopicIds]);

  const selectedTopicLabel = useMemo(() => {
    if (selectedTopicId === ALL_TOPICS) return 'Any topics';
    const topic = apiTopics.find((t) => String(t.id) === selectedTopicId);
    return topic?.name ?? 'Topic';
  }, [selectedTopicId, apiTopics]);

  const favouriteTopicCount = useMemo(
    () => apiTopics.filter((t) => favouriteTopicIds.includes(t.id)).length,
    [apiTopics, favouriteTopicIds]
  );

  const effectiveWager = useMemo(() => {
    if (!isLoggedIn || wagerAmount <= 0 || wagerAmount === ALL_WAGERS) return 0;
    if (walletBalance !== null && walletBalance < wagerAmount) return 0;
    return wagerAmount;
  }, [isLoggedIn, wagerAmount, walletBalance]);

  const handleWagerSelect = (amount: number) => {
    if (!isLoggedIn) return;
    setWagerAmount(amount);
    saveWager(amount);
    setWagerModalVisible(false);
  };

  const wagerDisplayLabel = useMemo(() => {
    if (wagerAmount === ALL_WAGERS) return 'All wagers';
    return wagerAmount === 0 ? 'None' : `$${wagerAmount}`;
  }, [wagerAmount]);

  const handleChallenge = useCallback(
    (entry: ActiveTriviaGame) => {
      const wager = isLoggedIn && effectiveWager > 0 ? effectiveWager : 0;
      navigation.navigate('Quiz', {
        topicId: Number(entry.topicId),
        opponentTopicId: Number(entry.topicId),
        opponentName: entry.userName ?? 'Opponent',
        wagerAmount: wager,
        fromChallenge: true,
        gameId: entry.gameId,
      });
    },
    [isLoggedIn, effectiveWager, navigation]
  );

  const canStartNewBattle = useMemo(() => {
    if (topicsLoading) return false;
    if (selectedTopicId !== ALL_TOPICS) {
      return apiTopics.some((t) => String(t.id) === selectedTopicId);
    }
    return apiTopics.length > 0;
  }, [selectedTopicId, apiTopics, topicsLoading]);

  const handleStartNewBattle = useCallback(() => {
    if (!canStartNewBattle) return;
    let topicId: number;
    let opponentTopicId: number;

    if (selectedTopicId !== ALL_TOPICS) {
      topicId = Number(selectedTopicId);
      opponentTopicId = topicId;
    } else {
      const picked = pickRandomTopic(apiTopics);
      topicId = picked.id;
      opponentTopicId = picked.id;
    }

    const wager = isLoggedIn && effectiveWager > 0 ? effectiveWager : 0;
    navigation.navigate('Quiz', {
      topicId,
      opponentTopicId,
      wagerAmount: wager,
      fromChallenge: true,
    });
  }, [canStartNewBattle, selectedTopicId, apiTopics, isLoggedIn, effectiveWager, navigation]);

  const openWagerModal = useCallback(() => {
    if (!isLoggedIn) {
      navigation.navigate('Login');
      return;
    }
    getWalletBalance().then(setWalletBalance);
    setWagerModalVisible(true);
  }, [isLoggedIn, navigation]);

  return (
    <ScrollView
      style={globalStyles.screenContainer}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
        />
      }
    >
      <View style={styles.wagerDisplayRow}>
        <View style={styles.wagerSpacer} />
        <View style={styles.wagerCenterSection}>
          <Text style={styles.wagerLabel}>
            {!isLoggedIn ? '' : 'Wager'}
          </Text>
          <TouchableOpacity
            style={[
              styles.wagerChip,
              styles.wagerChipDisplay,
              isLoggedIn && (wagerAmount === ALL_WAGERS || wagerAmount > 0) && styles.wagerChipSelected,
              !isLoggedIn && styles.wagerChipDisabled,
            ]}
            onPress={openWagerModal}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.wagerChipText,
                isLoggedIn && (wagerAmount === ALL_WAGERS || wagerAmount > 0) && styles.wagerChipTextSelected,
                !isLoggedIn && styles.wagerChipTextDisabled,
              ]}
            >
              {!isLoggedIn ? 'Log in to wager' : wagerLoaded ? wagerDisplayLabel : '...'}
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

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setTopicFilterModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="filter" size={20} color={theme.colors.primary} />
        <Text style={styles.filterButtonText}>
          {topicsLoading ? 'Loading topics...' : selectedTopicLabel}
        </Text>
        {topicsLoading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <Ionicons name="chevron-down" size={20} color={theme.colors.textMuted} />
        )}
      </TouchableOpacity>

      <Modal
        visible={topicFilterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTopicFilterModalVisible(false)}
      >
        <Pressable style={globalStyles.modalOverlay} onPress={() => setTopicFilterModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Filter by topic</Text>
            
            <View style={triviaTopicStyles.favToggleRow}>
              <Text style={triviaTopicStyles.favToggleHint}>Favourites</Text>
              <TouchableOpacity
                style={[
                  triviaTopicStyles.favFilterChip,
                  showFavouritesOnly && triviaTopicStyles.favFilterChipSelected,
                ]}
                onPress={() => setShowFavouritesOnly((prev) => !prev)}
                activeOpacity={0.8}
                accessibilityLabel={showFavouritesOnly ? 'Show all topics' : 'Show favourite topics only'}
              >
                <View>
                  <Ionicons
                    name="star"
                    size={22}
                    color={showFavouritesOnly ? theme.colors.primary : theme.colors.textMuted}
                  />
                  {favouriteTopicCount > 0 && (
                    <View style={triviaTopicStyles.favCountBadge}>
                      <Text style={triviaTopicStyles.favCountText}>{favouriteTopicCount}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <TextInput
              style={triviaTopicStyles.topicSearchInput}
              placeholder="Search topics..."
              placeholderTextColor={theme.colors.textMuted}
              value={topicSearch}
              onChangeText={setTopicSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <FlatList
              data={topicOptions}
              keyExtractor={(item) => item.id}
              style={styles.topicList}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={triviaTopicStyles.topicListEmpty}>
                  {showFavouritesOnly && favouriteTopicCount === 0
                    ? 'No favourites yet. Tap the star next to a topic to add it.'
                    : 'No topics match your search.'}
                </Text>
              }
              renderItem={({ item }) => {
                const isFav = item.id !== ALL_TOPICS && favouriteTopicIds.includes(Number(item.id));
                return (
                  <View style={[
                    styles.topicOptionRow,
                    selectedTopicId === item.id && triviaTopicStyles.topicRowSelected,
                  ]}>
                    <TouchableOpacity
                      style={styles.topicOptionMain}
                      onPress={() => {
                        setSelectedTopicId(item.id);
                        setTopicFilterModalVisible(false);
                        setTopicSearch('');
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.topicOptionText,
                        selectedTopicId === item.id && styles.topicOptionTextSelected,
                      ]}>
                        {item.name}
                      </Text>
                      {selectedTopicId === item.id && (
                        <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                      )}
                    </TouchableOpacity>

                    {item.id !== ALL_TOPICS && (
                      <TouchableOpacity
                        style={triviaTopicStyles.topicFavButton}
                        onPress={() => handleToggleFavouriteTopic(Number(item.id))}
                        activeOpacity={0.8}
                        accessibilityLabel={isFav ? 'Remove from favourites' : 'Add to favourites'}
                      >
                        <Ionicons
                          name={isFav ? 'star' : 'star-outline'}
                          size={22}
                          color={isFav ? theme.colors.primary : theme.colors.textMuted}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={wagerModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWagerModalVisible(false)}
      >
        <Pressable style={globalStyles.modalOverlay} onPress={() => setWagerModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={globalStyles.modalTitle}>Select wager amount</Text>
            <View style={styles.modalChips}>
              {WAGER_OPTIONS.map((opt) => {
                const exceedsBalance = opt.value > 0 && walletBalance !== null && opt.value > walletBalance;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.wagerChip,
                      wagerAmount === opt.value && styles.wagerChipSelected,
                      exceedsBalance && styles.wagerChipDisabled,
                    ]}
                    onPress={() => !exceedsBalance && handleWagerSelect(opt.value)}
                    activeOpacity={0.8}
                    disabled={exceedsBalance}
                  >
                    <Text
                      style={[
                        styles.wagerChipText,
                        wagerAmount === opt.value && styles.wagerChipTextSelected,
                        exceedsBalance && styles.wagerChipTextDisabled,
                      ]}
                    >
                      {opt.label}
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

      <View style={styles.newBattleRow}>
        <TouchableOpacity
          style={[styles.newBattleButton, !canStartNewBattle && styles.newBattleButtonDisabled]}
          onPress={handleStartNewBattle}
          disabled={!canStartNewBattle}
          activeOpacity={0.8}
        >
          <Text style={styles.newBattleButtonText}>Start a new battle</Text>
        </TouchableOpacity>
      </View>

      {filteredActiveTriviaGames.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          {activeTriviaGamesError ? (
            <Text style={[globalStyles.emptyState, styles.historyErrorText]}>
              {activeTriviaGamesError}
            </Text>
          ) : null}
          {!activeTriviaGamesError && activeTriviaGamesLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : null}
          {!activeTriviaGamesError && !activeTriviaGamesLoading ? (
            <Text style={globalStyles.emptyState}>
              {!isLoggedIn
                ? 'Log in to see quiz history from your account.'
                : activeTriviaGames.length === 0
                ? "No quiz results yet. Finish a quiz while logged in to see it here."
                : 'No quizzes match the selected filters. Try different topic or wager.'}
            </Text>
          ) : null}
          {activeTriviaGamesError ? (
            <TouchableOpacity
              style={globalStyles.secondaryButton}
              onPress={() => void loadActiveTriviaGames()}
              activeOpacity={0.8}
            >
              <Text style={globalStyles.secondaryButtonText}>Retry</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : (
        filteredActiveTriviaGames.map((entry) => (
          <View
            key={entry.gameId}
            style={[styles.entry, { borderLeftColor: topicAccentColorForId(entry.topicName) }]}
          >
            <View style={styles.entryContent}>
              <Text style={styles.playerText} numberOfLines={1}>
                {entry.userName ?? 'Unknown'}
              </Text>
              <Text style={styles.topicName} numberOfLines={1}>
                {entry.topicName}
              </Text>
              <Text style={styles.wagerText} numberOfLines={1}>
                {entry.wagerAmount != null && entry.wagerAmount > 0
                  ? `$${entry.wagerAmount}`
                  : isLoggedIn ? 'No wager' : ''}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.challengeButton}
              onPress={() => handleChallenge(entry)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="sword-cross" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  newBattleRow: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  newBattleButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.16)',
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.5)',
  },
  newBattleButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  newBattleButtonDisabled: {
    opacity: 0.5,
  },
  historyErrorText: {
    color: theme.colors.accent,
    textAlign: 'center',
  },
  topicOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.sm,
  },
  topicOptionMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  emptyStateContainer: {
    alignItems: 'center',
    gap: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 0,
    paddingBottom: theme.spacing.xl,
  },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 4,
    gap: theme.spacing.md,
  },
  entryContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.text,
  },
  topicName: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  wagerText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.primary,
    textAlign: 'right',
  },
  challengeButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.surfaceLight,
  },
  filterButtonText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 360,
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: theme.colors.surfaceLight,
  },
  modalTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  topicSearchInput: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.surfaceLight,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  topicList: {
    maxHeight: 300,
  },
  topicOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.sm,
  },
  topicOptionSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  topicOptionText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  topicOptionTextSelected: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
  wagerDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
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
});