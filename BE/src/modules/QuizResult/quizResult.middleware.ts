import { AppError, CatchAsyncError } from "../../middlewares/errorHandler";
import { NextFunction, Request, Response } from "express";
import { QuizResultRepository } from "../../common/Respositories/quizResult.repository";


export const alreadySubmitted = CatchAsyncError(async (req: Request, res: Response , next: NextFunction) => {
  const { quizId } = req.params; 
  const userId = req.user.id;
  const quizResultRepo = new QuizResultRepository()
  const quizzies = await quizResultRepo.findUnique({quiz: quizId, student: userId})
  if (quizzies) next(new AppError("You have already submitted this quiz", 400));
  next()
})