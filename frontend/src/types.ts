export const TRIVIA_GAME_STATUS_FINISHED = 'Finished';

export interface QuestionTopic {
    id: number;
    name: string;
}

export interface Question {
    id: number;
    topicId: number;
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
    questionId: number;
    choiceId: number;
}

export interface BattleParticipant {
    id: string;
    name: string;
    correct: number;
    timeMs: number;
    isCurrentUser?: boolean;
}

export interface ActiveTriviaGame {
    gameId: number;
    userId: number;
    userName: string;
    wagerAmount: number;
    topicId: number;
    topicName: string;
    status: string;
}

export interface ArenaLeaderboardResult{
    userId: number;
    userName: string;
    wins: number;
    losses: number;
    gamesPlayed: number;
    totalCorrectAnswers: number;
    totalTimeTakenInSeconds: number;
}

export interface Arena{
    id: number;
    arenaName: string;
    arenaCode: string;
    arenaOwner: number;
    wagerAmount: number;
    members: ArenaMember[];
}

export interface ArenaMember{
    userId: number;
    userName: string;
}

export interface BattleState {
    id: string;
    topicId: number;
    participants: BattleParticipant[];
    status: 'waiting' | 'playing' | 'finished';
    questionCount: number;
}