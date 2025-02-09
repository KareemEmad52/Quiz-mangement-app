import { Request, Response } from "express";

import {
  getReasonPhrase,
  getStatusCode,
  StatusCodes,
} from "http-status-codes/build/cjs";
import { AppError, CatchAsyncError } from "../../middlewares/errorHandler";
import { QuizService } from "./quiz.service";
import { QuizRepository } from "../../common/Respositories/quiz.repository";
import { UserRepository } from "../../common/Respositories/user.repository";
import { QuestionRepository } from "../../common/Respositories/question.repository";
const quizRepository = new QuizRepository();
const userRepository = new UserRepository();
const questionRepository = new QuestionRepository();
const quizService = new QuizService(
  quizRepository,
  userRepository,
  questionRepository
);

export const createQuiz = CatchAsyncError(
  async (req: Request, res: Response) => {
    req.body.teacher = req.user.id;
    const { quiz } = await quizService.createQuiz(req.body);
    res.status(StatusCodes.OK).json({
      message: getReasonPhrase(StatusCodes.OK),
      status: getStatusCode(getReasonPhrase(StatusCodes.OK)),
      data: quiz,
    });
  }
);

export const getAllQuizes = CatchAsyncError(
  async (req: Request, res: Response) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const Quizzes = await quizService.getAllQuizes();
    if (!Quizzes) throw new AppError("Quizzes not found", 404);
    res.status(StatusCodes.OK).json({
      message: getReasonPhrase(StatusCodes.OK),
      status: getStatusCode(getReasonPhrase(StatusCodes.OK)),
      data: Quizzes,
    });
  }
);

export const getSpecificQuiz = CatchAsyncError(
  async (req: Request, res: Response) => {
    const Quiz = await quizService.getSpecificQuiz(req.params.quizId);
    if (!Quiz) throw new AppError("Quiz not found", 404);
    res.status(StatusCodes.OK).json({
      message: getReasonPhrase(StatusCodes.OK),
      status: getStatusCode(getReasonPhrase(StatusCodes.OK)),
      data: Quiz,
    });
  }
);
export const updateSpecificQuiz = CatchAsyncError(
  async (req: Request, res: Response) => {
    const updatedQuiz = await quizService.updateQuiz(
      req.params.quizId,
      req.user.id,
      req.body
    );
    if (!updatedQuiz) throw new AppError("Quiz not found", 404);
    res.status(StatusCodes.OK).json({
      message: getReasonPhrase(StatusCodes.OK),
      status: getStatusCode(getReasonPhrase(StatusCodes.OK)),
      data: updatedQuiz,
    });
  }
);

export const deleteSpecificQuiz = CatchAsyncError(
  async (req: Request, res: Response) => {
    const deletedQuiz = await quizService.deleteQuiz(req.params.quizId , req.user.id);
    if (!deletedQuiz.deleted) throw new AppError("An error occurred while deleting quiz", 404);
    res.status(StatusCodes.OK).json({
      message: getReasonPhrase(StatusCodes.OK),
      status: getStatusCode(getReasonPhrase(StatusCodes.OK)),
      data: deletedQuiz,
    });
})