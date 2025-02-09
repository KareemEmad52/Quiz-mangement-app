import {CreateQuizResponse, DeleteQuizResponse, EditQuizResponse, GetStudentsResponse, LoginData, LoginResponse, QuizAnswersDto, QuizOutput, QuizResponse, QuizSubmissionResponse, QuizWithResultsResponse, SignupData, SpecificQuizResponse, SpecificQuizResultsResponse} from "@/types/types";
import axios from "axios";
import {useAppStore} from "@/lib/Store/Store";


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = useAppStore.getState().token;
  if (token) {
    config.headers.token = `${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const signup = async (data: SignupData) => {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/register`, data);
  return res
}

export const login = async (data: LoginData): Promise<LoginResponse> => {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/login`, data);
  return res.data
}

export const getAllQuizzes = async (): Promise<QuizResponse> => {
  const res = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/quizes`);
  return res.data
}

export const createNewQuiz = async (data: QuizOutput): Promise<CreateQuizResponse> =>{
  const res = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/quizes`, data); 
  return res.data
}

export const deleteQuiz = async (id: string): Promise<DeleteQuizResponse> => {
  const res = await api.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/quizes/${id}`);
  return res.data
}

export const getSpacificQuizData = async (id: string , token: string): Promise<SpecificQuizResponse> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/quizes/${id}`,{
    headers: {
      token
    }
  });
  return res.data
}


export const getAllQuizzesResults = async (): Promise<QuizWithResultsResponse> =>{
  const res = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/results/users/results`);
  return res.data
}

export const getSpecificQuizResults = async (id: string): Promise<SpecificQuizResultsResponse> => {
  const res = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/results/${id}/results`);
  return res.data
}

export const quizSubmit = async (data:QuizAnswersDto , quizId: string) : Promise<QuizSubmissionResponse> =>{
  const res = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/results/${quizId}/submit`, data);
  return res.data
}

export const getAllStudents = async (): Promise<GetStudentsResponse> =>{
  const res = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`);
  return res.data
}

export const updateQuiz = async (data: QuizOutput, id: string): Promise<EditQuizResponse> => {
  const res = await api.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/quizes/${id}`, data);
  return res.data
}