import React, { useEffect, useMemo } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
//import { saveUserAnswers } from "@/services/triviaService";
import { useTheme } from "@/app/ThemeProvider";
import Button from "@/components/button";

const QuestionAnswerResultScreen = () => {
  const { styles, theme } = useTheme();
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");
  const answersString = searchParams.get("answers");
  const questionResults = useMemo(() => {
    return answersString ? JSON.parse(answersString) : [];
  }, [answersString]);

  useEffect(() => {
    const saveUserAnswers = async () => {
      if (gameId && questionResults.length > 0) {
        try {
          // await saveAnswers(parseInt(gameId), questionResults);
          console.log("Answers saved successfully!");
        } catch (error) {
          console.error("Failed to save answers:", error);
          Alert.alert("Error", "Failed to save your answers. Please try again.");
        }
      }
    };

    saveUserAnswers();
  }, [gameId, questionResults]);

  if (!questionResults || questionResults.length === 0) {
    return (
      <View style={styles.screenContainer}>
        <Text style={styles.errorText}>No results available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <FlatList
        data={questionResults}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Question: {item.text}</Text>
              <Text style={styles.text}>Your Answer: {item.options[0].text}{item.options[0].isCorrect ? " ✅" : " ❌"}</Text>
            </View>
          );
        }}
      />
      <Button
        text="Start Again"
        onPress={() => router.replace("/screens/games/trivia/topicSelectionScreen")}
      />
    </View>
  );
};

export default QuestionAnswerResultScreen;