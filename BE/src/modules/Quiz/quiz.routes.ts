import { Router } from "express";
import { Authenticate } from "../Auth/Auth.middlewares";
import { validate } from "../../middlewares/ValidateRequests";
import { IdParamTeacherSchema, IdParamQuizSchema, quizValidationSchema, updateDeadLineQuizValidationSchema, updateQuizValidationSchema } from "./quiz.validations";
import { createQuiz, deleteSpecificQuiz, getAllQuizes, getSpecificQuiz, updateSpecificQuiz } from "./quiz.controller";

const router = Router()

router.post('/', Authenticate, validate(quizValidationSchema) , createQuiz)
router.get('/', Authenticate, getAllQuizes)


// router.patch('/update-deadline/:quizId', Authenticate, validate(updateDeadLineQuizValidationSchema) , updateDeadLineOfSpecificQuiz)

// router.get('/teacher-quizes/:teacherId', Authenticate,validate(IdParamTeacherSchema) , getAllQuizesForOneTeacher)

router.route('/:quizId')
.get(Authenticate , validate(IdParamQuizSchema) , getSpecificQuiz)
.put(Authenticate ,validate(updateQuizValidationSchema) ,  updateSpecificQuiz)
.delete(Authenticate , validate(IdParamQuizSchema) , deleteSpecificQuiz)

export default router