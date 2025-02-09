"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_middlewares_1 = require("../Auth/Auth.middlewares");
const ValidateRequests_1 = require("../../middlewares/ValidateRequests");
const quiz_validations_1 = require("./quiz.validations");
const quiz_controller_1 = require("./quiz.controller");
const router = (0, express_1.Router)();
router.post('/', Auth_middlewares_1.Authenticate, (0, ValidateRequests_1.validate)(quiz_validations_1.quizValidationSchema), quiz_controller_1.createQuiz);
router.get('/', Auth_middlewares_1.Authenticate, quiz_controller_1.getAllQuizes);
// router.patch('/update-deadline/:quizId', Authenticate, validate(updateDeadLineQuizValidationSchema) , updateDeadLineOfSpecificQuiz)
// router.get('/teacher-quizes/:teacherId', Authenticate,validate(IdParamTeacherSchema) , getAllQuizesForOneTeacher)
router.route('/:quizId')
    .get(Auth_middlewares_1.Authenticate, (0, ValidateRequests_1.validate)(quiz_validations_1.IdParamQuizSchema), quiz_controller_1.getSpecificQuiz)
    .put(Auth_middlewares_1.Authenticate, (0, ValidateRequests_1.validate)(quiz_validations_1.updateQuizValidationSchema), quiz_controller_1.updateSpecificQuiz)
    .delete(Auth_middlewares_1.Authenticate, (0, ValidateRequests_1.validate)(quiz_validations_1.IdParamQuizSchema), quiz_controller_1.deleteSpecificQuiz);
exports.default = router;
//# sourceMappingURL=quiz.routes.js.map