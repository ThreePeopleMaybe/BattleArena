import type { QuizQuestionResult } from '../types';

export type RootStackParamList = {
    GameSelection: undefined;
    Home: { gameTypeId: number };
    Archery: undefined;
    Bowling: undefined;
    Challenge:
        | {
            arenaId?: number;
            gameTypeId: number;
        }
        | undefined;
    ArenaHome: { gameTypeId: number };
    JoinArena: { gameTypeId: number };
    ArenaLobby: { arenaId: number; gameTypeId: number; isHost?: boolean };
    ArenaLeaderboard: { arenaId: number; gameTypeId: number };
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
};