import { StateCreator } from "zustand";

export interface QuizSlice {
  currentQuestion: number;
  answers: Record<string, string>;
  isFinished: boolean;
  startTime: number | null;
  quizId: string | null;
  duration: number | null;
  timeRemaining: number | null;
  lastActiveTime: number | null;
  timeTaken: number | null;

  // Actions
  startQuiz: (quizId: string, duration: number) => boolean;
  setAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitQuiz: () => void;
  retakeQuiz: () => void;
  updateTimeRemaining: () => void;
  checkQuizStatus: () => {
    canStart: boolean;
    message?: string;
  };
}
export const createQuizSlice: StateCreator<QuizSlice> = (set, get) => ({
  currentQuestion: 0,
  answers: {},
  isFinished: false,
  startTime: null,
  quizId: null,
  duration: null,
  timeRemaining: null,
  lastActiveTime: null,
  timeTaken: null,

  startQuiz: (quizId: string, duration: number) => {
    const status = get().checkQuizStatus();

    if(get().quizId === quizId) return true;

    if (!status.canStart) {
      return false;
    }

    set({
      quizId,
      startTime: Date.now(),
      duration: duration * 60 * 1000, // Convert minutes to milliseconds
      timeRemaining: duration * 60 * 1000,
      lastActiveTime: Date.now(),
      currentQuestion: 0,
      answers: {},
      isFinished: false,
      timeTaken: null,
    });
    return true;
  },

  setAnswer: (questionId: string, answer: string) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: answer,
      },
    }));
  },

  nextQuestion: () => {
    set((state) => ({
      currentQuestion: state.currentQuestion + 1,
    }));
  },

  prevQuestion: () => {
    set((state) => ({
      currentQuestion: Math.max(0, state.currentQuestion - 1),
    }));
  },

  submitQuiz: () => {
    const state = get();
    const now = Date.now();
    const timeTaken = state.startTime ? now - state.startTime : 0; // Calculate time taken

    set({
      isFinished: true,
      timeTaken,
    });
  },

  retakeQuiz: () => {
    set({
      currentQuestion: 0,
      answers: {},
      isFinished: false,
      startTime: null,
      quizId: null,
      duration: null,
      timeRemaining: null,
      lastActiveTime: null,
      timeTaken: null,
    });
  },

  updateTimeRemaining: () => {
    const state = get();
    if (!state.startTime || !state.duration || !state.lastActiveTime) return;

    const now = Date.now();
    const timePassed = now - state.lastActiveTime;
    const newTimeRemaining = Math.max(0, (state.timeRemaining || 0) - timePassed);

    set({
      timeRemaining: newTimeRemaining,
      lastActiveTime: now,
    });

    // Auto-submit if time is up
    if (newTimeRemaining <= 0) {
      get().submitQuiz();
    }
  },

  checkQuizStatus: () => {
    const state = get();
    
    
    // If there's no active quiz, can start
    if (!state.quizId) {
      return { canStart: true };
    }

    // If quiz is finished, can start new one
    if (state.isFinished) {
      return { canStart: true };
    }

    // If time has expired, can start new one
    if (state.timeRemaining && state.timeRemaining <= 0) {
      return { canStart: true };
    }

    // Otherwise, there's an active quiz that needs to be completed
    return {
      canStart: false,
      message: 'Please complete your active quiz before starting a new one.',
    };
  },
})