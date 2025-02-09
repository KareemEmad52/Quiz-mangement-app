import {  User } from "@/types/types";
import { StateCreator } from "zustand";

export interface UserSlice  {
  user: User
  token: string
  setUser: (user: User) => void
  SetToken: (token: string) => void
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  user: {} as User,
  token: "",
  SetToken: (token: string) => set(() => ({ token })),
  setUser: (user: User) => set(() => ({ user })),
});
