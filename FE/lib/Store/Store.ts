import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QuizState } from "@/types/types";
import { createQuizSlice, QuizSlice } from "./Slices/quizSlice";
import { createUserSlice, UserSlice } from "./Slices/userSlice";


export type AppStore = QuizSlice & UserSlice ;


export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createQuizSlice(...a),
      ...createUserSlice(...a),
    }),
    {
      name: "appStore",
      partialize: (state: AppStore) => {
        const { currentQuestion, answers, isFinished ,user , ...rest} = state;
        return { currentQuestion, answers, isFinished, user , ...rest };
      },
    }
  )
);