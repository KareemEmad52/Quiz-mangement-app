import { Router } from "express";
import { Authenticate } from "../Auth/Auth.middlewares";
import { validate } from "../../middlewares/ValidateRequests";
import {
  checkSubmitions,
  getQuizResultsByQuiz,
  getQuizResultsByUser,
  submitQuiz,
} from "./quizResult.controller";
import { submitQuizValidationSchema } from "./quizResult.validate";
import { alreadySubmitted } from "./quizResult.middleware";

const router = Router();

router.post(
  "/:quizId/submit",
  Authenticate,
  alreadySubmitted,
  validate(submitQuizValidationSchema),
  submitQuiz
);

router.get("/submit/:quizId", Authenticate ,alreadySubmitted , checkSubmitions)

//Get all quiz results for a user
router.get("/users/results", Authenticate, getQuizResultsByUser);

//Get all User's Quiz  by a QuizID
router.get("/:quizId/results", Authenticate, getQuizResultsByQuiz);

// //Get a specific quiz result
// router.get('/results/:quizResultId', Authenticate, getQuizResultById);

export default router;
