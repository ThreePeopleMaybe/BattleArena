import COLORS from "@/styleguide/colors";
import SPACING from "@/styleguide/spacing";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import styles from "@/styleguide/styles";
export default function QuestionAnswerScreen() {
  // Example question and answers
  const question = {
    text: "What is the capital of France?",
    options: [
      { id: 1, text: "Berlin", isCorrect: false },
      { id: 2, text: "Madrid", isCorrect: false },
      { id: 3, text: "Paris", isCorrect: true },
      { id: 4, text: "Rome", isCorrect: false },
    ],
  };

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleAnswer = (optionId: number, isCorrect: boolean) => {
    setSelectedOption(optionId);
    if (isCorrect) {
      Alert.alert("Correct!", "You got the right answer!");
    } else {
      Alert.alert("Wrong!", "Try again!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={localStyles.question}>{question.text}</Text>
      <View style={localStyles.optionsContainer}>
        {question.options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              localStyles.option,
              selectedOption === option.id && option.isCorrect
                ? localStyles.correctOption
                : selectedOption === option.id
                  ? localStyles.wrongOption
                  : null,
            ]}
            onPress={() => handleAnswer(option.id, option.isCorrect)}
            disabled={selectedOption !== null} // Disable buttons after selecting an answer
          >
            <Text style={localStyles.optionText}>{option.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    justifyContent: "center",
  },
  question: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  optionsContainer: {
    marginTop: SPACING.md,
  },
  option: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
    color: COLORS.darkText,
  },
  correctOption: {
    backgroundColor: "green",
  },
  wrongOption: {
    backgroundColor: "red",
  },
});