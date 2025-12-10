import React, { useEffect, useState, useContext, useMemo } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getGame } from "@/services/triviaService";
import { Question } from "@/models/question";
import { useTheme } from "@/app/ThemeProvider";
import { QuestionOption } from "@/models/questionOption";
import Button from "@/components/button";

export default function QuestionAnswerScreen() {
  const router = useRouter();
  const { styles, theme } = useTheme();

  // State to manage the game flow
  const [questions, setQuestions] = useState<Question[]>([]); // To store all questions
  const [question, setQuestion] = useState<Question>(new Question()); // The current question being displayed
  const [answers, setAnswers] = useState<any[]>([]); // To store user answers
  const [index, setIndex] = useState<number>(0); // Current question index
  const [timer, setTimer] = useState<number>(300); // Initialize timer to 300 seconds (5 minutes)

  // Fetch game data (using a mock `useQuery` here, based on imports)
  const { data: game, isLoading, isError } = useQuery({
    queryKey: ['game', 0], // The `0` is likely a placeholder user ID
    queryFn: () => getGame(0),
  });

  // Timer logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1); // Decrease timer every second
      }, 1000);
      return () => clearInterval(interval); // Cleanup interval on unmount
    } else {
      next(); // Navigate to next screen when timer hits 0
    }
  }, [timer]);

  // Set questions once game data is fetched
  useEffect(() => {
    if (game) {
      setQuestions(game.questions);
      setQuestion(game.questions[0]);
    }
  }, [game]);

  // Loading/Error UI
  if (isLoading) {
    return (
      <View style={styles.screenContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.screenContainer}>
        <Text>Failed to load questions. Please try again.</Text>
      </View>
    );
  }

  const handleAnswer = (question: Question, answer: QuestionOption) => {
    if (questions) {
      // Create a result object representing the question and the selected answer
      answers.push({ question: question.id, text: question.text, options: [answer] });
      setAnswers(answers); // Update the state

      // Wait briefly before moving to the next question
      setTimeout(() => {
        if (index < questions.length - 1) {
          setIndex(index + 1);
          setQuestion(questions[index + 1]);
        } else {
          next(); // Move to the results screen
        }
      }, 100);
    }
  };

  const next = () => {
    // Navigate to the results screen, passing the game ID and stringified answers
    router.push({
      pathname: "/screens/games/trivia/questionAnswerResultScreen",
      params: { gameId: game?.id, answers: JSON.stringify(answers) },
    });
  };

  // Timer formatting logic
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <View style={styles.screenContainer}>
      {/* Timer Display */}
      <Text style={styles.timer}>Time Left: {formattedTime}</Text>

      {/* Question Text */}
      <Text style={styles.question}>{question.text}</Text>

      {/* Answer Options */}
      <FlatList
        data={question.options}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.optionContainer}>
            <Pressable
              style={styles.optionButton}
              onPress={() => handleAnswer(question, item)}
            >
              <Text style={styles.optionText}>{item.text}</Text>
            </Pressable>
          </View>
        )}
      />

      <Button text="Exit" onPress={() => router.replace("/screens/games/trivia/topicSelectionScreen")} />
    </View>
  );
}