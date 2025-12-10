import { TriviaGame } from "@/models/triviaGame";

export async function getGame(userId: number): Promise<TriviaGame> {
  return {
    id: 1,
    questions: [
      {
        id: 1,
        text: "What is the capital of France?",
        options: [
          { id: 1, text: "Berlin", isCorrect: false },
          { id: 2, text: "Madrid", isCorrect: false },
          { id: 3, text: "Paris", isCorrect: true },
          { id: 4, text: "Rome", isCorrect: false },
        ],
      },
      {
        id: 2,
        text: "What is the capital of Italy?",
        options: [
          { id: 1, text: "Rome", isCorrect: false },
          { id: 2, text: "Florance", isCorrect: false },
          { id: 3, text: "Venice", isCorrect: true },
          { id: 4, text: "Tuscany", isCorrect: false },
        ],
      },
      {
        id: 3,
        text: "What is the capital of Germany?",
        options: [
          { id: 1, text: "Berlin", isCorrect: false },
          { id: 2, text: "Barcelona", isCorrect: false },
          { id: 3, text: "Milan", isCorrect: true },
          { id: 4, text: "Nice", isCorrect: false },
        ],
      },
    ],
  };
}