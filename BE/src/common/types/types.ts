import { ObjectId } from "mongoose";
import { IQuestion } from "../../DB/models/question.model";


export enum UserGender {
    MALE = "male",
    FEMALE = "female",
}
export enum StatusEnums {
    COMPLETED = 'completed',
    IN_PROGRESS = 'in_progress',
    COMING_SOON = 'coming_Soon'
}

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}


export interface AddUserDto {
    email: string;
    password: string;
    name: string,
    gender: UserGender;
    role?: UserRole
}


export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export interface Question {
    _id: string
    title: string,
    choices: string[]
    correctAnswer: string;
    quizId: string;
}

export interface LoginDto {
    email: string;
    password: string;
}


export interface createQuizDto {
    description: string;
    title: string;
    duration: string;
    questions: Question[];
    startingTime: Date;
    status: StatusEnums;
    deadline: string;
    teacher: string;
}

export interface AnswerDataType {
    questionId: string,
    selected: string
}

export interface QuizWithQuestionsDto {
    _id: unknown;
    title: string;
    description: string;
    duration: number;
    startTime: Date;
    status: string;
    deadline: Date;
    teacher: ObjectId;
    questions: IQuestion[];
  }

export interface deleteQuizReturnType {
    deleted: boolean
}

export interface addQuestionToQuizDto {
    title: string,
    choices: string[],
    correctAnswer: string,
    quizId: string
}

export interface deleteQuestionDto {
    questionId: string
}