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
    Teams: undefined;
    SelectOpponent: | {
        battleAgainOpponentName?: string;
        wagerAmount?: number;
    } | undefined;
    MatchingOpponent: {
        opponentNames: string[];
        wagerAmount?: number;
        startInWaitingPhase?: boolean;
    };
    Topics: | {
        mode?: 'battle';
        yourTopicId?: number;
        opponentName?: string;
        wagerAmount?: number;
        fromArena?: boolean;
        arenaId?: number;
        fromChallenge?: boolean;
    } | undefined;
    Quiz: {
        topicId: number;
        opponentTopicId?: number;
        battleMode?: boolean;
        opponentName?: string;
        wagerAmount?: number;
        arenaId?: number;
        fromChallenge?: boolean;
        gameId?: number;
    };
    Battle: {
        topicId: number;
        opponentTopicId?: number;
        opponentName: string;
        wagerAmount: number;
        arenaId?: number;
        fromChallenge?: boolean;
        gameId?: number;
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
    WaitingForPlayers: | {
        mode: 'arena';
        arenaId: number;
        topicId?: number;
        userCorrect: number;
        userTimeMs: number;
        questionCount?: number;
    } | {
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