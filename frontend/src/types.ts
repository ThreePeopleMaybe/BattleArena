export type TopicId = number;

export interface Question {
  id: number;
  topicId: TopicId;
  text: string;
  choices: QuestionChoice[];
}

export interface QuestionChoice {
  id: number;
  text: string;
  isCorrectChoice: boolean;
}

export interface QuizQuestionResult {
  question: Question;
  selectedIndex: number;
}

export interface QuizResult {
  correct: number;
  total: number;
  timeMs: number;
  topicId: TopicId;
}

export interface BattleParticipant {
  id: string;
  name: string;
  correct: number;
  timeMs: number;
  isCurrentUser?: boolean;
}

export interface BattleState {
  id: string;
  topicId: TopicId;
  participants: BattleParticipant[];
  status: 'waiting' | 'playing' | 'finished';
  questionCount: number;
}