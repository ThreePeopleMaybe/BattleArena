import type { QuizQuestionResult } from '../types';

export type RootStackParamList = {
  Home: undefined;
  Challenge: undefined;
  ArenaHome: undefined;
  JoinArena: undefined;
  ArenaLobby: { arenaId: string; isHost?: boolean };
  Login: undefined;
  SignUp: undefined;
  Profile: undefined;
  Teams: undefined;
  CreateTeam: { teamId?: string };
  SelectOpponent: 
    | {
        battleAgainOpponentName?: string;
        wagerAmount?: number;
        fromChallenge?: boolean;
      }
    | undefined;
  MatchingOpponent: {
    opponentNames: string[];
    wagerAmount?: number;
    startInWaitingPhase?: boolean;
    fromChallenge?: boolean;
  };
  Topics:
    | {
        mode?: 'battle';
        yourTopicId?: number;
        opponentName?: string;
        wagerAmount?: number;
        fromArena?: boolean;
        arenaId?: string;
        fromChallenge?: boolean;
      }
    | undefined;
  Quiz: {
    topicId: number;
    opponentTopicId?: number;
    battleMode?: boolean;
    opponentName?: string;
    wagerAmount?: number;
    arenaId?: string;
    fromChallenge?: boolean;
  };
  Battle: {
    topicId: number;
    opponentTopicId?: number;
    opponentName: string;
    wagerAmount: number;
    arenaId?: string;
    fromChallenge?: boolean;
  };
  BattleResult: {
    topicId: number;
    userCorrect: number;
    userTimeMs: number;
    opponentCorrect: number;
    opponentTimeMs: number;
    opponentName: string;
    questionResults?: QuizQuestionResult[];
    wagerAmount?: number;
    fromChallenge?: boolean;
  };
  ArenaResult: {
    arenaId: string;
    topicId: number;
    userCorrect: number;
    userTimeMs: number;
    questionCount?: number;
  };
  WaitingForPlayers:
    | {
        mode: 'arena';
        arenaId: string;
        topicId?: number;
        userCorrect: number;
        userTimeMs: number;
        questionCount?: number;
      }
    | {
        mode: 'battle';
        topicId: number;
        userCorrect: number;
        userTimeMs: number;
        opponentCorrect: number;
        opponentTimeMs: number;
        opponentName: string;
        questionResults?: QuizQuestionResult[];
        wagerAmount?: number;
      };
};