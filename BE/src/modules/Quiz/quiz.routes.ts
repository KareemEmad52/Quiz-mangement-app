import { Router } from "express";
import {Authenticate, Authorize} from "../Auth/Auth.middlewares";
import { validate } from "../../middlewares/ValidateRequests";
import { IdParamTeacherSchema, IdParamQuizSchema, quizValidationSchema, updateDeadLineQuizValidationSchema, updateQuizValidationSchema } from "./quiz.validations";
import { AddQuestionToSpecificQuiz, createQuiz, DeleteQuestionFromSpecificQuiz, deleteSpecificQuiz, getAllQuizes, getSpecificQuiz, updateSpecificQuiz } from "./quiz.controller";
import {UserRole} from "../../common/types/types";

const router = Router()

router.post('/', Authenticate, validate(quizValidationSchema) , createQuiz)
router.get('/', Authenticate, getAllQuizes)


router.route('/:quizId')
.get(Authenticate , validate(IdParamQuizSchema) , getSpecificQuiz)
.put(Authenticate ,validate(updateQuizValidationSchema) ,  updateSpecificQuiz)
.delete(Authenticate , validate(IdParamQuizSchema) , deleteSpecificQuiz)

router.patch("/:quizId", Authenticate , Authorize(UserRole.ADMIN), AddQuestionToSpecificQuiz)
router.delete("/:quizId/question", Authenticate , Authorize(UserRole.ADMIN), DeleteQuestionFromSpecificQuiz)

export default router