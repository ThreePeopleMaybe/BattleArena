import type { QuizQuestionResult } from '../types';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  SignUp: undefined;
  Profile: undefined;
  Teams: undefined;
  CreateTeam: { teamId?: string };
  SelectOpponent: { battleAgainOpponentName?: string; wagerAmount?: number } | undefined;
  MatchingOpponent: { opponentNames: string[]; wagerAmount?: number; startInWaitingPhase?: boolean };
  Topics: { mode?: 'battle'; yourTopicId?: string; opponentName?: string; wagerAmount?: number } | undefined;
  Quiz: { topicId: string; opponentTopicId?: string; battleMode?: boolean; opponentName?: string; wagerAmount?: number };
  Battle: { topicId: string; opponentTopicId: string; opponentName: string; wagerAmount: number };
  BattleResult: {
    topicId: string;
    userCorrect: number;
    userTimeMs: number;
    opponentCorrect: number;
    opponentTimeMs: number;
    opponentName: string;
    questionResults?: QuizQuestionResult[];
    wagerAmount?: number;
  };
};