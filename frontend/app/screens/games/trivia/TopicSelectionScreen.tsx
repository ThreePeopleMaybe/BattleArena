import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import Button from "@/components/button";
import { TopicSelection } from "@/models/topicSelection";
import { getAvailableTopics } from "@/services/referenceDataService";
import { useTheme } from "@/app/ThemeProvider";

export default function TopicSelectionScreen({}) {
  const { styles, theme } = useTheme();
  const [favoriteTopic, setFavoriteTopic] = useState<TopicSelection[] | null>(null);
  const [localAvailableTopics, setAvailableTopics] = useState<TopicSelection[] | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean | null>(null);
  const router = useRouter();

  const { data: availableTopics, isLoading, isError } = useQuery({
    queryKey: ["availableTopics"],
    queryFn: getAvailableTopics,
  });

  if (isLoading) {
    return (
      <View style={[styles.screenContainer]}>
        <ActivityIndicator size="large" color="#0007BFF" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.screenContainer]}>
        <Text style={[styles.errorText]}>Failed to load topics. Please try again.</Text>
      </View>
    );
  }

  const handleTopicSelect = (topic: TopicSelection) => {
    router.push({
      pathname: "/screens/games/trivia/questionAnswerScreen",
      params: { topicName: topic.name },
    });
  };

  const filteredTopics = localAvailableTopics
    ? showFavoritesOnly
      ? localAvailableTopics.filter((topic) => topic.isFavorite)
      : localAvailableTopics
    : availableTopics;

  const handleSetFavorite = (topic: TopicSelection) => {
    const topics = localAvailableTopics || availableTopics || [];
    const updatedTopics = topics.map((t) =>
      t.name === topic.name ? { ...t, isFavorite: !t.isFavorite } : t
    );
    if (updatedTopics) {
      setAvailableTopics(updatedTopics);
    }
    const favoriteTopics = updatedTopics?.filter((t) => t.isFavorite);
    if(favoriteTopics){
      setFavoriteTopic(favoriteTopics || []);
    }
  };

  const handleFilterFavorites = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  return (
    <View style={[styles.screenContainer]}>
      <Button
        onPress={handleFilterFavorites}
        text={showFavoritesOnly ? "Show All Topics" : "Show Favorites"}
      />
      <FlatList
        data={filteredTopics}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.optionContainer]}>
            <Pressable
              style={[styles.optionButton]}
              onPress={() => handleTopicSelect(item)}
            >
              <Text style={[styles.optionText]}>{item.name}</Text>
            </Pressable>
            <Pressable
              style={[
                styles.favoriteButton,
                (favoriteTopic && favoriteTopic.find(f => f.name === item.name) !== undefined) && styles.favoriteButtonSelected,
              ]}
              onPress={() => handleSetFavorite(item)}
            >
              <Text style={[styles.favoriteButtonText]}>
                {(favoriteTopic && favoriteTopic.find(f => f.name === item.name) !== undefined) ? "♥" : "♡"}
              </Text>
            </Pressable>
          </View>
        )}
      />
      <Button text="Exit" onPress={() => router.replace("/screens/games/trivia/topicSelectionScreen")} />
    </View>
  );
};