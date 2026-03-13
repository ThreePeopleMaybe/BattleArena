import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { TOPICS } from '../../data/topics';
import { theme } from '../../theme';
import { globalStyles } from '../../styles/globalStyles';
import { RootStackParamList } from '../../navigation/types';
import type { Topic } from '../../types';
import { getFavouriteTopicIds, toggleFavouriteTopic } from '../../storage/favouritesStorage';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Topics'>;
  route: RouteProp<RootStackParamList, 'Topics'>;
};

function pickRandomTopic(topics: Topic[]): Topic {
  return topics[Math.floor(Math.random() * topics.length)];
}

export default function TopicsScreen({ navigation, route }: Props) {
  const isBattle = route.params?.mode === 'battle';
  const yourTopicId = route.params?.yourTopicId;
  const opponentName = route.params?.opponentName;
  const wagerAmount = route.params?.wagerAmount;
  const fromArena = route.params?.fromArena === true;
  const arenaId = route.params?.arenaId;
  const pickingOpponentTopic = isBattle && !!yourTopicId && !fromArena;

  const [search, setSearch] = useState('');
  const [favouriteTopicIds, setFavouriteTopicIds] = useState<string[]>([]);
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [autoSelectSecondsLeft, setAutoSelectSecondsLeft] = useState(30);

  useEffect(() => {
    getFavouriteTopicIds().then(setFavouriteTopicIds);
  }, []);

  const handleToggleFavouriteTopic = async (id: string) => {
    const next = await toggleFavouriteTopic(id);
    setFavouriteTopicIds(next);
  };

  const filteredTopics = useMemo(() => {
    const byFav = showFavouritesOnly
      ? TOPICS.filter((t) => favouriteTopicIds.includes(t.id))
      : TOPICS;
    const q = search.trim().toLowerCase();
    if (!q) return byFav;
    return byFav.filter((t) => t.name.toLowerCase().includes(q));
  }, [search, showFavouritesOnly, favouriteTopicIds]);

  const autoSelectIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleTopicPress = (topicId: string) => {
    if (autoSelectIntervalRef.current) {
      clearInterval(autoSelectIntervalRef.current);
      autoSelectIntervalRef.current = null;
    }
    if (!isBattle) {
      navigation.navigate('Quiz', { topicId });
      return;
    }
    if (fromArena) {
      navigation.navigate('Battle', {
        topicId,
        opponentTopicId: topicId,
        opponentName: 'Arena',
        wagerAmount: wagerAmount ?? 0,
        arenaId,
      });
      return;
    }
    if (pickingOpponentTopic) {
      navigation.navigate('Battle', {
        topicId: yourTopicId!,
        opponentTopicId: topicId,
        opponentName: opponentName ?? 'Opponent',
        wagerAmount: wagerAmount ?? 0,
      });
    } else {
      // Battle mode: auto-select same topic for opponent
      navigation.navigate('Battle', {
        topicId,
        opponentTopicId: topicId,
        opponentName: opponentName ?? 'Opponent',
        wagerAmount: wagerAmount ?? 0,
        arenaId,
      });
    }
  };

  const handleAutoSelect = () => {
    const list = filteredTopics.length > 0 ? filteredTopics : TOPICS;
    const picked = pickRandomTopic(list);
    handleTopicPress(picked.id);
  };

  const handleAutoSelectRef = useRef(handleAutoSelect);
  handleAutoSelectRef.current = handleAutoSelect;

  useEffect(() => {
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
  }, []);

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

      {!pickingOpponentTopic && (
        <View style={styles.countdownRow}>
          <Text style={styles.countdownText}>
            Auto-selecting topic in <Text style={styles.countdownNumber}>{autoSelectSecondsLeft}</Text>s
          </Text>
        </View>
      )}

      <View style={styles.autoPickRow}>
        <TouchableOpacity
          style={[globalStyles.smallButton, styles.autoSelectButtonFlex, buttonsDisabled && globalStyles.controlDisabled]}
          onPress={handleAutoSelect}
          activeOpacity={0.8}
          disabled={buttonsDisabled}
        >
          <Text style={[globalStyles.smallButtonText, buttonsDisabled && globalStyles.controlDisabledText]}>🎲 Auto select</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterIconBtn, showFavouritesOnly && styles.filterIconBtnSelected, buttonsDisabled && globalStyles.controlDisabled]}
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
            {favouriteTopicIds.length > 0 && (
              <View style={styles.favCountBadge}>
                <Text style={styles.favCountText}>{favouriteTopicIds.length}</Text>
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
        {filteredTopics.length === 0 ? (
          <Text style={globalStyles.emptyState}>
            {showFavouritesOnly && favouriteTopicIds.length === 0
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
                  <Text style={styles.topicRowIcon}>{topic.icon}</Text>
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
  containerExtra: {
    paddingBottom: 0,
  },
  countdownRow: {
    marginBottom: theme.spacing.md,
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
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  autoSelectButtonFlex: {
    flex: 1,
  },
  filterIconBtn: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceLight,
  },
  filterIconBtnSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  favCountBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  favCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  list: {
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  topicRowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  topicRowIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  topicRowName: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  favButton: {
    padding: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wagerBanner: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  wagerBannerMuted: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfaceLight,
  },
  wagerBannerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  wagerBannerLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
  },
  wagerBannerAmount: {
    fontSize: theme.fontSize.sm,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  wagerBannerAmountMuted: {
    color: theme.colors.textMuted,
  },
  waitingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.surfaceLight,
  },
  waitingSpinner: {
    marginRight: theme.spacing.md,
  },
  waitingBannerTextWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  waitingText: {
    fontSize: theme.fontSize.sm,
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
});