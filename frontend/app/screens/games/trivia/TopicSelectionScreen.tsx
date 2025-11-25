import React, { useState } from "react";
import { View, Text, FlatList, Pressable, TextInput, Alert, StyleSheet } from "react-native";
import styles from "@/styleguide/styles";
import Button from "@/components/button";
import COLORS from "@/styleguide/colors";

const TopicSelectionScreen = () => {
  const [topics, setTopics] = useState([
    "Science",
    "History",
    "Sports",
    "Movies",
    "Music",
    "Music",
    "Music",
    "Music",
    "Music",
    "Music",
    "Music",
    "Music",
    "Music",
    "Music",
  ]);

  const [newTopic, setNewTopic] = useState("");
  const [favoriteTopic, setFavoriteTopic] = useState<string | null>(null);

  const handleTopicSelect = (topic: string) => {
    Alert.alert("Topic Selected", `You selected: ${topic}`);
  };

  const handleSuggestTopic = () => {
    if (newTopic.trim() === "") {
      Alert.alert("Error", "Please enter a topic name.");
      return;
    }

    if (topics.includes(newTopic)) {
      Alert.alert("Topic Exists", "This topic already exists.");
      return;
    }

    setTopics([...topics, newTopic]);
    setNewTopic("");
    Alert.alert("Success", "Your topic has been added.");
  };

  const handleSetFavorite = (topic: string) => {
    setFavoriteTopic(topic);
    Alert.alert("Favorite Topic", `You set "${topic}" as your favorite topic.`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={topics}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={localStyles.topicContainer}>
            <Pressable
              style={localStyles.topicButton}
              onPress={() => handleTopicSelect(item)}
            >
              <Text style={localStyles.topicText}>{item}</Text>
            </Pressable>

            <Pressable
              style={[
                localStyles.favoriteButton,
                favoriteTopic === item && localStyles.favoriteButtonSelected,
              ]}
              onPress={() => handleSetFavorite(item)}
            >
              <Text style={localStyles.favoriteButtonText}>
                {favoriteTopic === item ? "❤️" : "🤍"}
              </Text>
            </Pressable>
          </View>
        )}
        contentContainerStyle={localStyles.flatListContent}
      />

      <View style={localStyles.suggestContainer}>
        <TextInput
          style={localStyles.input}
          placeholder="Suggest a new topic"
          value={newTopic}
          onChangeText={setNewTopic}
        />
       <Pressable style={localStyles.suggestButton} onPress={handleSuggestTopic}>
          <Text style={localStyles.suggestButtonText}>Suggest</Text>
        </Pressable>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
    suggestButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    backgroundColor: "#FFFFFF",
  },
  suggestButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  flatListContent: {
    paddingBottom: 20
  },
  topicContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingRight: 10
  },
  topicButton: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    marginRight: 10,
  },
  topicText: {
    fontSize: 18,
    fontWeight: "500",
  },
  favoriteButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#EEEEEE",
  },
  favoriteButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  favoriteButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  suggestContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  }
});

export default TopicSelectionScreen;