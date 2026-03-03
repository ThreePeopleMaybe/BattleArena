export type TopicId = 'science' | 'music' | 'biology' | 'history' | 'geography' | 'sports' | 'movies' | 'general';

export interface Topic {
  id: TopicId;
  name: string;
  icon: string;
  color: string;
}

export interface Question {
  id: string;
  topicId: TopicId;
  question: string;
  options: string[];
  correctIndex: number;
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