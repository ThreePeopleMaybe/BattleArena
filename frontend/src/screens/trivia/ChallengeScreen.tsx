import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
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
import { useAuth } from '../../context/AuthContext';
import { TOPICS } from '../../data/topics';
import { RootStackParamList } from '../../navigation/types';
import { getQuizHistory, seedDummyQuizHistory, type QuizHistoryEntry } from '../../storage/quizHistoryStorage';
import { getSavedWager, saveWager } from '../../storage/wagerStorage';
import { getWalletBalance } from '../../storage/walletStorage';
import { globalStyles } from '../../styles/globalStyles';
import { theme } from '../../theme';

const ALL_WAGERS = -1;
const WAGER_OPTIONS: { value: number; label: string }[] = [
  { value: ALL_WAGERS, label: 'All wagers' },
  { value: 0, label: 'None' },
  { value: 1, label: '$1' },
  { value: 5, label: '$5' },
  { value: 10, label: '$10' },
  { value: 25, label: '$25' },
];

function getTopicColor(topicId: string): string {
  return TOPICS.find((t) => t.id === topicId)?.color ?? theme.colors.primary;
}

const ALL_TOPICS = 'all';

interface TopicOption {
  id: string;
  name: string;
  icon?: string;
}

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Challenge'>;
};

export default function ChallengeScreen({ navigation }: Props) {
  const { isLoggedIn } = useAuth();
  const [history, setHistory] = useState<QuizHistoryEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(ALL_TOPICS);
  const [topicFilterModalVisible, setTopicFilterModalVisible] = useState(false);
  const [topicSearch, setTopicSearch] = useState('');
  const [wagerAmount, setWagerAmount] = useState(ALL_WAGERS);
  const [wagerLoaded, setWagerLoaded] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [wagerModalVisible, setWagerModalVisible] = useState(false);

  const loadHistory = useCallback(async () => {
    await seedDummyQuizHistory();
    const data = await getQuizHistory();
    setHistory(data);
  }, []);

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
      loadHistory();
    }, [loadHistory])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  }, [loadHistory]);

  const filteredHistory = useMemo(() => {
    let result = history;
    if (!isLoggedIn) {
      result = result.filter((e) => (e.wagerAmount ?? 0) === 0);
    }
    if (selectedTopicId !== ALL_TOPICS) {
      result = result.filter((e) => e.topicId === selectedTopicId);
    }
    if (wagerAmount !== ALL_WAGERS) {
      result = result.filter((e) => (e.wagerAmount ?? 0) === wagerAmount);
    }
    return result;
  }, [history, selectedTopicId, wagerAmount, isLoggedIn]);

  const topicOptions: TopicOption[] = useMemo(() => {
    const all: TopicOption = { id: ALL_TOPICS, name: 'All topics' };
    const list = [all, ...TOPICS.map((t) => ({ id: t.id, name: t.name, icon: t.icon }))];
    const q = topicSearch.trim().toLowerCase();
    if (!q) return list;
    return list.filter((t) => t.name.toLowerCase().includes(q));
  }, [topicSearch]);

  const selectedTopicLabel = useMemo(() => {
    if (selectedTopicId === ALL_TOPICS) return 'All topics';
    const t = TOPICS.find((x) => x.id === selectedTopicId);
    return t ? `${t.icon ?? ''} ${t.name}`.trim() : selectedTopicId;
  }, [selectedTopicId]);

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
    (entry: QuizHistoryEntry) => {
      const wager = isLoggedIn && effectiveWager > 0 ? effectiveWager : 0;
      navigation.navigate('Battle', {
        topicId: entry.topicId,
        opponentTopicId: entry.topicId,
        opponentName: entry.playerName ?? 'Opponent',
        wagerAmount: wager,
        fromChallenge: true,
      });
    },
    [isLoggedIn, effectiveWager, navigation]
  );

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
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
      }
    >
      <View style={styles.wagerDisplayRow}>
        <View style={styles.wagerSpacer} />
        <View style={styles.wagerCenterSection}>
          <Text style={styles.wagerLabel}>{!isLoggedIn ? '' : 'Wager'}</Text>
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
    <Text style={styles.filterButtonText}>{selectedTopicLabel}</Text>
    <Ionicons name="chevron-down" size={20} color={theme.colors.textMuted} />
  </TouchableOpacity>

  <Modal
    visible={topicFilterModalVisible}
    transparent
    animationType="fade"
    onRequestClose={() => setTopicFilterModalVisible(false)}
  >
    <Pressable style={styles.modalOverlay} onPress={() => setTopicFilterModalVisible(false)}>
      <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
        <Text style={styles.modalTitle}>Filter by topic</Text>
        <TextInput
          style={styles.topicSearchInput}
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
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.topicOption, selectedTopicId === item.id && styles.topicOptionSelected]}
              onPress={() => {
                setSelectedTopicId(item.id);
                setTopicFilterModalVisible(false);
                setTopicSearch('');
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.topicOptionText, selectedTopicId === item.id && styles.topicOptionTextSelected]}>
                {item.icon ? `${item.icon} ` : ''}{item.name}
              </Text>
              {selectedTopicId === item.id && (
                <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
          )}
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
    <Pressable style={styles.modalOverlay} onPress={() => setWagerModalVisible(false)}>
      <Pressable style={globalStyles.modalContent} onPress={(e) => e.stopPropagation()}>
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

  {filteredHistory.length === 0 ? (
    <View style={styles.emptyStateContainer}>
      <Text style={globalStyles.emptyState}>
        {history.length === 0
          ? 'No quizzes yet. Play a battle or arena to see history here.'
          : 'No quizzes match the selected filters. Try different topic or wager.'}
      </Text>
      <TouchableOpacity
        style={globalStyles.primaryButton}
        onPress={() => navigation.navigate('Topics', { 
          mode: 'battle', 
          wagerAmount: effectiveWager > 0 ? effectiveWager : undefined,
          fromChallenge: true 
        })}
        activeOpacity={0.8}
      >
        <Text style={globalStyles.primaryButtonText}>Start a new battle</Text>
      </TouchableOpacity>
    </View>
  ) : (
    filteredHistory.map((entry) => (
      <View
        key={entry.id}
        style={[styles.entry, { borderLeftColor: getTopicColor(entry.topicId) }]}
      >
        <View style={styles.entryContent}>
          <Text style={styles.playerText} numberOfLines={1}>{entry.playerName ?? 'Unknown'}</Text>
          <Text style={styles.topicName} numberOfLines={1}>{entry.topicName}</Text>
          <Text style={styles.wagerText} numberOfLines={1}>
            {entry.wagerAmount != null && entry.wagerAmount > 0 
              ? `$${entry.wagerAmount}` 
              : (isLoggedIn ? 'No wager' : '')}
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