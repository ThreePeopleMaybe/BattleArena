import type { QuizQuestionResult } from '../types';

export type RootStackParamList = {
  Home: undefined;
  JoinArena: undefined;
  ArenaLobby: { arenaId: string; isHost?: boolean };
  Login: undefined;
  SignUp: undefined;
  Profile: undefined;
  Teams: undefined;
  CreateTeam: { teamId?: string };
  SelectOpponent: { battleAgainOpponentName?: string; wagerAmount?: number } | undefined;
  MatchingOpponent: { opponentNames: string[]; wagerAmount?: number; startInWaitingPhase?: boolean };
  Topics: { mode?: 'battle'; yourTopicId?: string; opponentName?: string; wagerAmount?: number; fromArena?: boolean; arenaId?: string } | undefined;
  Quiz: { topicId: string; opponentTopicId?: string; battleMode?: boolean; opponentName?: string; wagerAmount?: number; arenaId?: string };
  Battle: { topicId: string; opponentTopicId: string; opponentName: string; wagerAmount: number; arenaId?: string };
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
  ArenaResult: {
    arenaId: string;
    userCorrect: number;
    userTimeMs: number;
    questionCount?: number;
  };
  WaitingForPlayers:
    | {
        mode: 'arena';
        arenaId: string;
        userCorrect: number;
        userTimeMs: number;
        questionCount?: number;
      }
    | {
        mode: 'battle';
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