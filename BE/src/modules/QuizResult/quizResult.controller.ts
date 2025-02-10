import {NextFunction, Request, Response} from "express";

import { getReasonPhrase, getStatusCode, StatusCodes } from "http-status-codes/build/cjs";
import { AppError, CatchAsyncError } from "../../middlewares/errorHandler";
import { QuizRepository } from "../../common/Respositories/quiz.repository";
import { UserRepository } from '../../common/Respositories/user.repository';
import { QuestionRepository } from "../../common/Respositories/question.repository";
import { QuizResultService } from "./quizResult.service";
import { QuizResultRepository } from "../../common/Respositories/quizResult.repository";
const quizRepository = new QuizRepository();
const userRepository = new UserRepository();
const questionRepository = new QuestionRepository();
const quizResultRepository = new QuizResultRepository();
const quizResultService = new QuizResultService(quizRepository, userRepository , questionRepository , quizResultRepository);

export const submitQuiz = CatchAsyncError(async (req: Request, res: Response) => {
  const { quizId } = req.params; 
  const userId = req.user.id; 
  const { answers } = req.body;

  // Call the service to submit the quiz
  const quizResult = await quizResultService.submitQuiz(quizId, userId, answers);

  // Send the response
  res.status(StatusCodes.OK).json({
      message: getReasonPhrase(StatusCodes.OK),
      status: StatusCodes.OK,
      data: quizResult,
  });
})

export const getQuizResultsByUser = CatchAsyncError(async (req: Request, res: Response) => {
    const results = await quizResultService.getQuizResultsByUser(req.user.id)
    if (!results) throw new AppError("quiz result not found", 404)
    res.status(StatusCodes.OK).json({
        message: getReasonPhrase(StatusCodes.OK),
        status: getStatusCode(getReasonPhrase(StatusCodes.OK)),
        data: results,
    });
})


// Get User's Quiz  by a QuizID
export const getQuizResultsByQuiz = CatchAsyncError(async (req: Request, res: Response) => {
    const results = await quizResultService.getQuizResultsByQuiz(req.params.quizId , req.user.id)
    if (!results) throw new AppError("quiz result not found", 404)
    res.status(StatusCodes.OK).json({
        message: getReasonPhrase(StatusCodes.OK),
        status: getStatusCode(getReasonPhrase(StatusCodes.OK)),
        data: results,
    });
})

export const checkSubmitions = CatchAsyncError(async (req: Request, res:Response)=>{
  res.status(StatusCodes.OK).json({
      message: getReasonPhrase(StatusCodes.OK),
      status: StatusCodes.OK,
  });
})