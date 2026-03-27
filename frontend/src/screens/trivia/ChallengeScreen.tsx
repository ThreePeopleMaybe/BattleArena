import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, type RouteProp } from '@react-navigation/native';
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
  View
} from 'react-native';
import { getArenaById, leaveArena } from '../../api/arena';
import { DEFAULT_TRIVIA_GAME_TYPE_ID, getActiveTriviaGame } from '../../api/triviaGame';
import { useAuth } from '../../context/AuthContext';
import { useQuestionTopics } from '../../hooks/useQuestionTopics';
import { RootStackParamList } from '../../navigation/types';
import { getFavouriteTopicIds, toggleFavouriteTopic } from '../../storage/favouritesStorage';
import { getSavedWager, saveWager } from '../../storage/wagerStorage';
import { getWalletBalance } from '../../storage/walletStorage';
import { globalStyles } from '../../styles/globalStyles';
import { triviaTopicStyles } from '../../styles/triviaTopicStyles';
import { theme } from '../../theme';
import { ActiveTriviaGame, Arena, QuestionTopic } from '../../types';

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

const MAX_ACTIVE_ARENA_TRIVIA_GAMES_PER_USER = 3;

interface TopicOption {
  id: string;
  name: string;
}

function entryMatchesTopic(entry: ActiveTriviaGame, topic: QuestionTopic): boolean {
  if (entry.topicId === topic.id) return true;
  const a = entry.topicName.trim().toLowerCase();
  const b = topic.name.trim().toLowerCase();
  return a.length > 0 && a === b;
}

function pickRandomTopic(topics: QuestionTopic[]): QuestionTopic {
  return topics[Math.floor(Math.random() * topics.length)];
}

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Challenge'>;
  route: RouteProp<RootStackParamList, 'Challenge'>;
};

export default function ChallengeScreen({ navigation, route }: Props) {
  const arenaId = route.params?.arenaId ?? 0;
  const showWagerControls = arenaId <= 0;

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
  const [arenaDetail, setArenaDetail] = useState<Arena | null>(null);
  const [arenaDetailLoading, setArenaDetailLoading] = useState(() => arenaId > 0);
  const [battleLimitModalVisible, setBattleLimitModalVisible] = useState(false);
  const [leaveArenaModalVisible, setLeaveArenaModalVisible] = useState(false);
  const [leaveArenaBusy, setLeaveArenaBusy] = useState(false);
  const [leaveArenaError, setLeaveArenaError] = useState<string | null>(null);

  const loadArenaDetail = useCallback(async () => {
    if (arenaId <= 0) {
      setArenaDetail(null);
      setArenaDetailLoading(false);
      return;
    }
    setArenaDetailLoading(true);
    try {
      const arena = await getArenaById(arenaId);
      setArenaDetail(arena);
    } catch {
      setArenaDetail(null);
    } finally {
      setArenaDetailLoading(false);
    }
  }, [arenaId]);

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
      const rows = await getActiveTriviaGame(DEFAULT_TRIVIA_GAME_TYPE_ID, arenaId);
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
      void loadArenaDetail();
    }, [loadActiveTriviaGames, loadTopics, loadArenaDetail])
  );

  const handleToggleFavouriteTopic = useCallback(async (id: number) => {
    const next = await toggleFavouriteTopic(id);
    setFavouriteTopicIds(next);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadActiveTriviaGames(), loadTopics(), loadArenaDetail()]);
    setRefreshing(false);
  }, [loadActiveTriviaGames, loadTopics, loadArenaDetail]);

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
    if (showWagerControls && wagerAmount !== ALL_WAGERS) {
      result = result.filter((e) => (e.wagerAmount ?? 0) === wagerAmount);
    }
    return result;
  }, [activeTriviaGames, selectedTopicId, wagerAmount, isLoggedIn, apiTopics, showWagerControls]);

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

  const isArenaHost = useMemo(() => {
    const uid = user?.userId;
    if (uid == null || !arenaDetail) return false;
    return Number(arenaDetail.arenaOwner) === Number(uid);
  }, [user?.userId, arenaDetail]);

  const isArenaMemberNotHost = useMemo(() => {
    const uid = user?.userId;
    if (uid == null || !arenaDetail || isArenaHost) return false;
    return arenaDetail.members.some((m) => Number(m.userId) === Number(uid));
  }, [user?.userId, arenaDetail, isArenaHost]);

  const tournamentPrizePool = useMemo(() => {
    if (arenaId <= 0 || !arenaDetail) return null;
    const uniqueMemberIds = new Set<number>();
    for (const m of arenaDetail.members) {
      uniqueMemberIds.add(Number(m.userId));
    }
    uniqueMemberIds.add(Number(arenaDetail.arenaOwner));
    const memberCount = uniqueMemberIds.size;
    const wager = arenaDetail.wagerAmount ?? 0;
    return memberCount * wager;
  }, [arenaId, arenaDetail]);

  const effectiveWager = useMemo(() => {
    if (!showWagerControls) return 0;
    if (!isLoggedIn || wagerAmount <= 0 || wagerAmount === ALL_WAGERS) return 0;
    if (walletBalance !== null && walletBalance < wagerAmount) return 0;
    return wagerAmount;
  }, [showWagerControls, isLoggedIn, wagerAmount, walletBalance]);

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
        arenaId: arenaId,
      });
    },
    [isLoggedIn, effectiveWager, navigation, arenaId]
  );

  const canStartNewBattle = useMemo(() => {
    if (topicsLoading) return false;
    if (selectedTopicId !== ALL_TOPICS) {
      return apiTopics.some((t) => String(t.id) === selectedTopicId);
    }
    return apiTopics.length > 0;
  }, [selectedTopicId, apiTopics, topicsLoading]);

  const myActiveArenaTriviaGameCount = useMemo(() => {
    if (arenaId <= 0) return 0;
    const uid = user?.userId;
    if (uid == null) return 0;
    const ids = new Set<number>();
    for (const entry of activeTriviaGames) {
      if (entry.userId === uid) ids.add(entry.gameId);
    }
    return ids.size;
  }, [arenaId, user?.userId, activeTriviaGames]);

  const handleStartNewBattle = useCallback(() => {
    if (!canStartNewBattle) return;
    if (
      arenaId > 0 &&
      user?.userId != null &&
      myActiveArenaTriviaGameCount >= MAX_ACTIVE_ARENA_TRIVIA_GAMES_PER_USER
    ) {
      setBattleLimitModalVisible(true);
      return;
    }
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
      arenaId: arenaId,
    });
  }, [
    arenaId,
    canStartNewBattle,
    effectiveWager,
    isLoggedIn,
    myActiveArenaTriviaGameCount,
    navigation,
    selectedTopicId,
    apiTopics,
    user?.userId,
  ]);

  const openWagerModal = useCallback(() => {
    if (!showWagerControls) return;
    if (!isLoggedIn) {
      navigation.navigate('Login');
      return;
    }
    getWalletBalance().then(setWalletBalance);
    setWagerModalVisible(true);
  }, [showWagerControls, isLoggedIn, navigation]);

  const openLeaveArenaModal = useCallback(() => {
    setLeaveArenaError(null);
    setLeaveArenaModalVisible(true);
  }, []);

  const closeLeaveArenaModal = useCallback(() => {
    if (leaveArenaBusy) return;
    setLeaveArenaModalVisible(false);
    setLeaveArenaError(null);
  }, [leaveArenaBusy]);

  const confirmLeaveArena = useCallback(async () => {
    const uid = user?.userId;
    if (uid == null || arenaId <= 0) return;
    setLeaveArenaBusy(true);
    setLeaveArenaError(null);
    try {
      await leaveArena(arenaId, uid);
      setLeaveArenaModalVisible(false);
      navigation.replace('ArenaHome');
    } catch (e) {
      setLeaveArenaError(e instanceof Error ? e.message : 'Request failed.');
    } finally {
      setLeaveArenaBusy(false);
    }
  }, [user?.userId, arenaId, navigation]);

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
    {arenaId > 0 ? (
      <View style={styles.wagerDisplayRow}>
        <View style={styles.arenaHeaderLeft}>
          {isLoggedIn &&
          user?.userId != null &&
          arenaDetail &&
          !arenaDetailLoading &&
          isArenaMemberNotHost ? (
            <TouchableOpacity
              style={styles.arenaLeaveButtonHeader}
              onPress={openLeaveArenaModal}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Leave this tournament"
            >
              <Ionicons name="exit-outline" size={16} color={theme.colors.textMuted} />
              <Text style={styles.arenaLeaveButtonHeaderText} numberOfLines={2}>
                Leave
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.arenaHeaderCenter}>
          {arenaDetailLoading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Text style={styles.arenaNameTitle} numberOfLines={2}>
              {arenaDetail?.arenaName?.trim()}
            </Text>
          )}
        </View>

        <View style={[styles.arenaHeaderRight, styles.wagerSpacerTrailingRow]}>
          <TouchableOpacity
            style={[styles.arenaLeaderboardIconChip, styles.arenaLeaderboardIconOnly]}
            onPress={() => navigation.navigate('ArenaLeaderboard', { arenaId })}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Arena leaderboard"
          >
            <Ionicons name="trophy-outline" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
          {isLoggedIn ? (
            <View style={[styles.balanceChip, styles.balanceChipArenaPair]}>
              <Text style={styles.balanceLabel}>Prize pool</Text>
              <Text style={styles.balanceAmount}>
                {walletBalance !== null ? `$${tournamentPrizePool?.toFixed(2) ?? '0.00'}` : '...'}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    ) : (
      <View style={styles.wagerDisplayRow}>
        <View style={styles.wagerSpacer} />
        {showWagerControls ? (
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
        ) : null}

        <View
          style={[
            styles.wagerSpacer,
            isLoggedIn && styles.wagerSpacerTrailingRow,
          ]}
        >
          {isLoggedIn ? (
            <View style={styles.balanceChip}>
              <Text style={styles.balanceLabel}>Balance</Text>
              <Text style={styles.balanceAmount}>
                {walletBalance !== null ? `$${walletBalance.toFixed(2)}` : '...'}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    )}

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

    {/* Wager Selection Modal */}
    <Modal
      visible={showWagerControls && wagerModalVisible}
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

    <Modal
      visible={battleLimitModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setBattleLimitModalVisible(false)}
    >
      <Pressable style={globalStyles.modalOverlay} onPress={() => setBattleLimitModalVisible(false)}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <Text style={globalStyles.modalTitle}>Battle limit</Text>
          <Text style={styles.battleLimitModalBody}>
            You already have {MAX_ACTIVE_ARENA_TRIVIA_GAMES_PER_USER} active trivia games in this tournament.
            Please pick a game from the list below.
          </Text>
          <TouchableOpacity
            style={globalStyles.primaryButton}
            onPress={() => setBattleLimitModalVisible(false)}
            activeOpacity={0.8}
          >
            <Text style={globalStyles.primaryButtonText}>OK</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>

    <Modal
      visible={leaveArenaModalVisible}
      transparent
      animationType="fade"
      onRequestClose={closeLeaveArenaModal}
    >
      <Pressable style={globalStyles.modalOverlay} onPress={closeLeaveArenaModal}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <Text style={globalStyles.modalTitle}>Leave tournament?</Text>
          <Text style={styles.battleLimitModalBody}>
            You will leave this tournament and lose access until you join again with a code.
          </Text>
          {leaveArenaError ? (
            <Text style={styles.leaveArenaModalError}>{leaveArenaError}</Text>
          ) : null}
          <View style={styles.leaveArenaModalActions}>
            <TouchableOpacity
              style={globalStyles.secondaryButton}
              onPress={closeLeaveArenaModal}
              activeOpacity={0.8}
              disabled={leaveArenaBusy}
            >
              <Text style={globalStyles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={globalStyles.primaryButton}
              onPress={() => void confirmLeaveArena()}
              activeOpacity={0.8}
              disabled={leaveArenaBusy}
            >
              {leaveArenaBusy ? (
                <ActivityIndicator color={theme.colors.text} />
              ) : (
                <Text style={globalStyles.primaryButtonText}>Leave</Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>

    {/* New Battle Button */}
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

    {/* Active Games List / Empty States */}
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
              ? 'No quiz results yet. Finish a quiz while logged in to see it here.'
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
        <View key={entry.gameId} style={[styles.entry]}>
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

const ARENA_TRAILING_CHIP_HEIGHT = 56;

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
  wagerSpacerTrailingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  arenaLeaderboardIconChip: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  arenaLeaderboardIconOnly: {
    width: ARENA_TRAILING_CHIP_HEIGHT,
    height: ARENA_TRAILING_CHIP_HEIGHT,
    paddingVertical: 0,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arenaHeaderLeft: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: ARENA_TRAILING_CHIP_HEIGHT,
    paddingRight: theme.spacing.xs,
  },
  arenaHeaderCenter: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: theme.spacing.xl + theme.fontSize.xl,
    paddingHorizontal: theme.spacing.xs,
  },
  arenaHeaderRight: {
    flex: 1,
    minHeight: ARENA_TRAILING_CHIP_HEIGHT,
    justifyContent: 'center',
  },
  arenaLeaveButtonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: '100%',
    paddingVertical: 6,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.surfaceLight,
    backgroundColor: theme.colors.surface,
  },
  arenaLeaveButtonHeaderText: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
    lineHeight: 14,
  },
  arenaNameTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
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
  battleLimitModalBody: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  leaveArenaModalError: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
  },
  leaveArenaModalActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
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
  balanceChipArenaPair: {
    height: ARENA_TRAILING_CHIP_HEIGHT,
    justifyContent: 'center',
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