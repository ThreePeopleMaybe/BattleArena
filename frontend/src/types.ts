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
}

export interface BattleState {
    id: string;
    topicId: number;
    participants: BattleParticipant[];
    status: 'waiting' | 'playing' | 'finished';
    questionCount: number;
}