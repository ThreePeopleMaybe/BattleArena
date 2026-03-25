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
        arenaId?: string;
        fromChallenge?: boolean;
    } | undefined;
    Quiz: {
        topicId: number;
        opponentTopicId?: number;
        battleMode?: boolean;
        opponentName?: string;
        wagerAmount?: number;
        arenaId?: string;
        fromChallenge?: boolean;
        gameId?: number;
    };
    Battle: {
        topicId: number;
        opponentTopicId?: number;
        opponentName: string;
        wagerAmount: number;
        arenaId?: string;
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
        isChallenger?: boolean;
    };
    ArenaResult: {
        arenaId: string;
        topicId: number;
        userCorrect: number;
        userTimeMs: number;
        questionCount?: number;
    };
    WaitingForPlayers: | {
        mode: 'arena';
        arenaId: string;
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