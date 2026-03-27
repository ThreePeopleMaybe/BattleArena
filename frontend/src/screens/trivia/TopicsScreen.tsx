import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { QuestionTopic } from '../../../src/types';
import { useQuestionTopics } from '../../hooks/useQuestionTopics';
import { RootStackParamList } from '../../navigation/types';
import { getFavouriteTopicIds, toggleFavouriteTopic } from '../../storage/favouritesStorage';
import { globalStyles } from '../../styles/globalStyles';
import { triviaTopicStyles } from '../../styles/triviaTopicStyles';
import { theme } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Topics'>;
  route: RouteProp<RootStackParamList, 'Topics'>;
};

function pickRandomTopic(list: QuestionTopic[]): QuestionTopic {
  return list[Math.floor(Math.random() * list.length)];
}

export default function TopicsScreen({ navigation, route }: Props) {
  const isBattle = route.params?.mode === 'battle';
  const yourTopicId = route.params?.yourTopicId;
  const opponentName = route.params?.opponentName;
  const wagerAmount = route.params?.wagerAmount;
  const fromArena = route.params?.fromArena === true;
  const arenaId = route.params?.arenaId;
  const fromChallenge = route.params?.fromChallenge === true;
  const pickingOpponentTopic = isBattle && !!yourTopicId && !fromArena;

  const [search, setSearch] = useState('');
  const [favouriteTopicIds, setFavouriteTopicIds] = useState<number[]>([]);
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [autoSelectSecondsLeft, setAutoSelectSecondsLeft] = useState(30);

  const { topics: topics, loading: topicsLoading, loadFailed: topicsLoadFailed, reload: loadTopics } =
    useQuestionTopics();


  useFocusEffect(
    useCallback(() => {
      loadTopics();
      getFavouriteTopicIds().then(setFavouriteTopicIds);
    }, [loadTopics])
  );

  const handleToggleFavouriteTopic = async (topicId: number) => {
    const next = await toggleFavouriteTopic(topicId);
    setFavouriteTopicIds(next);
  };

  const filteredTopics = useMemo(() => {
    const byFav = showFavouritesOnly
      ? topics.filter((t) => favouriteTopicIds.includes(t.id))
      : topics;
    const q = search.trim().toLowerCase();
    if (!q) return byFav;
    return byFav.filter((t) => t.name.toLowerCase().includes(q));
  }, [search, showFavouritesOnly, favouriteTopicIds, topics]);

  const favouriteListedCount = useMemo(
    () => topics.filter((t) => favouriteTopicIds.includes(t.id)).length,
    [topics, favouriteTopicIds]
  );

  const autoSelectIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleTopicPress = (topicId: number) => {
    if (autoSelectIntervalRef.current) {
      clearInterval(autoSelectIntervalRef.current);
      autoSelectIntervalRef.current = null;
    }

    if (!isBattle) {
      navigation.navigate('Quiz', { topicId: topicId });
      return;
    }

    if (fromArena) {
      navigation.navigate('Quiz', {
        topicId: topicId,
        opponentTopicId: topicId,
        opponentName: 'Arena',
        wagerAmount: wagerAmount ?? 0,
        arenaId,
      });
      return;
    }

    if (pickingOpponentTopic) {
      navigation.navigate('Quiz', {
        topicId: topicId,
        opponentTopicId: topicId,
        opponentName: opponentName ?? 'Opponent',
        wagerAmount: wagerAmount ?? 0,
        fromChallenge
      });
    } else {
      navigation.navigate('Quiz', {
        topicId: topicId,
        opponentTopicId: topicId,
        opponentName: opponentName ?? 'Opponent',
        wagerAmount: wagerAmount ?? 0,
        arenaId,
        fromChallenge,
      });
    }
  };

  const canAutoSelectTopic = !topicsLoading && !topicsLoadFailed && topics.length > 0;

  const handleAutoSelect = () => {
    if (!canAutoSelectTopic) return;
    const list = filteredTopics.length > 0 ? filteredTopics : topics;
    if (list.length === 0) return;
    const picked = pickRandomTopic(list);
    handleTopicPress(picked.id);
  };

  const handleAutoSelectRef = useRef(handleAutoSelect);
  handleAutoSelectRef.current = handleAutoSelect;

  useEffect(() => {
    if (!canAutoSelectTopic) {
      if (autoSelectIntervalRef.current) {
        clearInterval(autoSelectIntervalRef.current);
        autoSelectIntervalRef.current = null;
      }
      setAutoSelectSecondsLeft(30);
      return;
    }

    setAutoSelectSecondsLeft(30);
const interval = setInterval(() => {
      setAutoSelectSecondsLeft((prev) => {
        if (prev <= 1) {
          if (autoSelectIntervalRef.current) {
            clearInterval(autoSelectIntervalRef.current);
            autoSelectIntervalRef.current = null;
          }
          setTimeout(() => handleAutoSelectRef.current(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    autoSelectIntervalRef.current = interval;
    return () => {
      if (autoSelectIntervalRef.current) {
        clearInterval(autoSelectIntervalRef.current);
        autoSelectIntervalRef.current = null;
      }
    };
  }, [canAutoSelectTopic]);

  const showSearch = isBattle;
  const buttonsDisabled = pickingOpponentTopic;

  return (
    <View style={[globalStyles.screenContainer, globalStyles.screenContainerPaddingMd, styles.containerExtra]}>
      {isBattle && (
        <View style={[styles.wagerBanner, (wagerAmount == null || wagerAmount <= 0) && styles.wagerBannerMuted]}>
          <View style={styles.wagerBannerInner}>
            <Ionicons
              name="cash-outline"
              size={20}
              color={wagerAmount != null && wagerAmount > 0 ? theme.colors.primary : theme.colors.textMuted}
            />
            <Text style={styles.wagerBannerLabel}>Stakes</Text>
            <Text style={[styles.wagerBannerAmount, (wagerAmount == null || wagerAmount <= 0) && styles.wagerBannerAmountMuted]}>
              {wagerAmount != null && wagerAmount > 0 ? `$${wagerAmount}` : 'No wager'}
            </Text>
          </View>
        </View>
      )}

      {pickingOpponentTopic && (
        <View style={styles.waitingBanner}>
          <ActivityIndicator size="small" color={theme.colors.primary} style={styles.waitingSpinner} />
          <View style={styles.waitingBannerTextWrap}>
            <Text style={styles.waitingText}>
              Waiting for {opponentName ?? 'FactFinder'} to select topic
            </Text>
            <Text style={styles.waitingCountdown}>
              <Text style={styles.waitingCountdownNumber}>{autoSelectSecondsLeft}</Text>s
            </Text>
          </View>
        </View>
      )}

      {!pickingOpponentTopic && canAutoSelectTopic && (
        <View style={styles.countdownRow}>
          <Text style={styles.countdownText}>
            Auto-selecting topic in <Text style={styles.countdownNumber}>{autoSelectSecondsLeft}</Text>s
          </Text>
        </View>
      )}

      <View style={styles.autoPickRow}>
        <TouchableOpacity
          style={[
            globalStyles.smallButton,
            styles.autoSelectButtonFlex,
            (buttonsDisabled || !canAutoSelectTopic) && globalStyles.controlDisabled,
          ]}
          onPress={handleAutoSelect}
          activeOpacity={0.8}
          disabled={buttonsDisabled || !canAutoSelectTopic}
        >
          <Text
            style={[
              globalStyles.smallButtonText,
              (buttonsDisabled || !canAutoSelectTopic) && globalStyles.controlDisabledText,
            ]}
          >
            🎲 Auto select
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            triviaTopicStyles.favFilterChip,
            showFavouritesOnly && triviaTopicStyles.favFilterChipSelected,
            buttonsDisabled && globalStyles.controlDisabled,
          ]}
          onPress={() => setShowFavouritesOnly((prev) => !prev)}
          activeOpacity={0.8}
          disabled={buttonsDisabled}
        >
          <View>
            <Ionicons
              name="star"
              size={22}
              color={showFavouritesOnly ? theme.colors.primary : theme.colors.textMuted}
            />
            {favouriteListedCount > 0 && (
              <View style={triviaTopicStyles.favCountBadge}>
                <Text style={triviaTopicStyles.favCountText}>{favouriteListedCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {showSearch && (
        <TextInput
          style={[globalStyles.searchInput, buttonsDisabled && globalStyles.controlDisabled]}
          placeholder="Search..."
          placeholderTextColor={theme.colors.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!buttonsDisabled}
        />
      )}

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {topicsLoading && topics.length === 0 ? (
          <View style={styles.topicsLoadingWrap}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : !topicsLoading && topics.length === 0 ? (
          <Text style={globalStyles.emptyState}>
            Could not load topics. Check that the API is running and try again.
          </Text>
        ) : filteredTopics.length === 0 ? (
          <Text style={globalStyles.emptyState}>
            {showFavouritesOnly && favouriteListedCount === 0
              ? 'No favourites yet. Tap the star on a topic to add it.'
              : showFavouritesOnly
              ? 'No favourite topics match your search.'
              : `No topics match "${search}"`}
          </Text>
        ) : (
          filteredTopics.map((topic) => {
            const isFav = favouriteTopicIds.includes(topic.id);
            return (
              <View key={topic.id} style={[styles.topicRow, { borderLeftColor: topic.color }, buttonsDisabled && globalStyles.controlDisabled]}>
                <TouchableOpacity
                  style={styles.topicRowMain}
                  onPress={() => handleTopicPress(topic.id)}
                  activeOpacity={0.8}
                  disabled={buttonsDisabled}
                >
                  <Text style={styles.topicRowName}>{topic.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.favButton}
                  onPress={() => handleToggleFavouriteTopic(topic.id)}
                  activeOpacity={0.8}
                  disabled={buttonsDisabled}
                >
                  <Ionicons
                    name={isFav ? 'star' : 'star-outline'}
                    size={22}
                    color={isFav ? theme.colors.primary : theme.colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerExtra: {},
  wagerBanner: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  wagerBannerMuted: {
    borderColor: theme.colors.surfaceLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  wagerBannerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  wagerBannerLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  wagerBannerAmount: {
    fontSize: theme.fontSize.lg,
    fontWeight: '800',
    color: theme.colors.primary,
    marginLeft: 'auto',
  },
  wagerBannerAmountMuted: {
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  waitingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.surfaceLight,
  },
  waitingSpinner: {
    marginRight: theme.spacing.sm,
  },
  waitingBannerTextWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waitingText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  waitingCountdown: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginLeft: theme.spacing.sm,
  },
  waitingCountdownNumber: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
  countdownRow: {
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
  },
  countdownText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  countdownNumber: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
  autoPickRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  autoSelectButtonFlex: {
    flex: 1,
  },
  filterIconBtn: {
    width: 48,
    minWidth: 48,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.surfaceLight,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIconBtnSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  favCountBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  favCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.text,
  },
  list: {
    paddingBottom: theme.spacing.xl,
  },
  topicsLoadingWrap: {
  paddingVertical: theme.spacing.xl,
  alignItems: 'center',
  justifyContent: 'center',
},
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    borderLeftWidth: 4,
  },
  topicRowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  favButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  topicRowIcon: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  topicRowName: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
});