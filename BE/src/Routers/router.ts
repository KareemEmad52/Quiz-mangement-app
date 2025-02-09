import { Router } from "express";
import userRouter from "../modules/Auth/Auth.routes";
import quizRouter from "../modules/Quiz/quiz.routes";
import QuizResultRouter from "../modules/QuizResult/quizResult.routes";

const router = Router()

router.use('/users' , userRouter)
router.use('/quizes' , quizRouter)
router.use('/results' , QuizResultRouter)


export default router;