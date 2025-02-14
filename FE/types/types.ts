export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum UserGender {
  MALE = "male",
  FEMALE = "female",
}
export enum StatusEnums {
  COMPLETED = "completed",
  IN_PROGRESS = "in_progress",
  COMING_SOON = "coming_Soon",
}

interface BaseQuistion {
  id: number;
  text: string;
  correctAnswer: string;
}

export interface User {
  id: string;
  name: string;
  gender: "male" | "female";
  email: string;
  role?: string;
}

export interface MultipleCoiceQuestion extends BaseQuistion {
  options: string[];
}

export interface QuizState {
  currentQuestion: number;
  answers: {
    [questionId: number]: string;
  };
  isFinished: boolean;
}

export type Quiz = {
  _id: string;
  description: string;
  title: string;
  duration: number;
  startingTime: string;
  status: StatusEnums;
  deadline: string;
  teacher: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
};

export type Question = {
  title: string;
  choices: string[];
  correctAnswer: string;
  quizId: string;
  _id: string;
  __v: number;
};

export type QuizInput = {
  quizTitle: string;
  quizDescription: string;
  quizDuration: string;
  dueDate: string;
  startTime: string;
  status: string;
  questions: {
    text: string;
    options: string[];
    correctAnswer: string;
  }[];
};

export type QuizOutput = {
  title: string;
  description: string;
  duration: number;
  questions: {
    title: string;
    choices: string[];
    correctAnswer: string;
  }[];
  startTime: string;
  status: string;
  deadline: string;
};

export interface SignupData {
  name: string;
  email: string;
  password: string;
  gender: UserGender;
  role?: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  status: number;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      gender: UserGender;
      role: UserRole;
    };
  };
}

export type QuizResponse = {
  message: string;
  status: number;
  data: Quiz[];
};

export type CreateQuizResponse = {
  message: string;
  status: number;
  data: {
    title: string;
    description: string;
    duration: number;
    status: StatusEnums;
    deadline: string;
    noOfQuests: number;
    teacher: string;
    questions: {
      title: string;
      choices: string[];
      correctAnswer: string;
      quizId: string;
      _id: string;
      __v: number;
    }[];
    _id: string;
    startTime: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
};

export interface DeleteQuizResponse {
  message: string;
  status: number;
  data: {
    deleted: boolean;
  };
}

export interface SpecificQuizResponse {
  message: string;
  status: number;
  data: Quiz;
}

interface Answer {
  question: string;
  answer: string;
  _id: string;
}

export interface QuizWithResultsResponse {
  message: string;
  status: number;
  data: {
    _id: string;
    student: string;
    quiz: Quiz;
    answers: Answer[];
    score: number;
    status: string;
    submittedAt: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }[];
}

export interface SpecificQuizResultsResponse {
  message: string;
  status: number;
  data: {
    _id: string;
    student: string;
    quiz: {
      _id: string;
      title: string;
      description: string;
      duration: number;
      noOfQuests: number;
      status: StatusEnums;
    };
    answers: {
      question: {
        title: string;
        choices: string[];
        correctAnswer: string;
      };
      answer: string;
      _id: string;
    }[];
    score: number;
    status: "graded" | "pending"; // Add more statuses if needed
    submittedAt: string; // Can use Date type if necessary
    createdAt: string;
    updatedAt: string;
    __v: number;
  }[];
}

export interface QuizSubmissionResponse {
  message: string;
  status: number;
  data: {
    student: string;
    quiz: string;
    answers: {
      question: string;
      answer: string;
      _id: string;
    }[];
    score: number;
    status: string;
    _id: string;
    submittedAt: string;
    __v: number;
  };
}

export interface QuizAnswersDto {
  answers: {
    questionId: string;
    selected: string;
  }[];
}

export type OriginalUpdatedQuiz = {
  quizTitle: string;
  quizDescription: string;
  quizDuration: number;
  dueDate: string;
  questions: {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
  }[];
};

export type ConvertedUpdatedQuiz = {
  title: string;
  description: string;
  duration: number;
  questions: {
    _id: string;
    title: string;
    choices: string[];
    correctAnswer: string;
  }[];
  startTime: string;
  status: string;
  deadline: string;
};

export interface Student {
  id: string;
  name: string;
  email: string;
  gender: UserGender;
  role: UserRole;
}

export interface GetStudentsResponse {
  message: string;
  status: number;
  data: Student[];
}

export interface EditQuizResponse {
  message: string;
  status: number;
  data: {
    _id: string;
    title: string;
    description: string;
    duration: number;
    status: "coming_Soon" | "active" | "ended";
    deadline: string; // ISO date string
    noOfQuests: number;
    teacher: string;
    questions: {
      _id: string;
      title: string;
      choices: string[];
      correctAnswer: string;
      quizId: string;
      __v: number;
    }[];
    startTime: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}
export interface checkSubmitionResponse {
  message: string;
  status: number;
}

export type AddQuestionToSpecificQuiz = {
  title: string;
  choices: string[];
  correctAnswer: string;
};

export interface AddquestionResponse {
  message: string;
  status: number;
  data: {
    _id: string;
    title: string;
    description: string;
    duration: number;
    status: StatusEnums;
    deadline: string;
    noOfQuests: number;
    teacher: string;
    questions: string[];
    startTime: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}
