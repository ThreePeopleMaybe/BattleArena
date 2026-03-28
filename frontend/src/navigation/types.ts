import type { QuizQuestionResult } from '../types';

export type RootStackParamList = {
    Home: undefined;
    Challenge: 
        | {
            arenaId?: number;
        }
        | undefined;
    ArenaHome: undefined;
    JoinArena: undefined;
    ArenaLobby: { arenaId: number; isHost?: boolean };
    ArenaLeaderboard: { arenaId: number };
    Login: undefined;
    SignUp: undefined;
    Profile: undefined;
    Quiz: {
        topicId: number;
        wagerAmount?: number;
        arenaId?: number;
        fromChallenge?: boolean;
        gameId?: number;
    };
    QuizResult: {
        topicId: number;
        userCorrect: number;
        userTimeMs: number;
        questionResults?: QuizQuestionResult[];
        wagerAmount?: number;
        fromChallenge?: boolean;
        arenaId?: number;
        isChallenger?: boolean;
    };
    ArenaResult: {
        arenaId: number;
        topicId: number;
        userCorrect: number;
        userTimeMs: number;
        questionCount?: number;
    };
};