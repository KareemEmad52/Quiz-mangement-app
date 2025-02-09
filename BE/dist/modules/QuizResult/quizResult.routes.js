"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_middlewares_1 = require("../Auth/Auth.middlewares");
const ValidateRequests_1 = require("../../middlewares/ValidateRequests");
const quizResult_controller_1 = require("./quizResult.controller");
const quizResult_validate_1 = require("./quizResult.validate");
const router = (0, express_1.Router)();
router.post('/:quizId/submit', Auth_middlewares_1.Authenticate, (0, ValidateRequests_1.validate)(quizResult_validate_1.submitQuizValidationSchema), quizResult_controller_1.submitQuiz);
//Get all quiz results for a user
router.get('/users/results', Auth_middlewares_1.Authenticate, quizResult_controller_1.getQuizResultsByUser);
//Get all User's Quiz  by a QuizID 
router.get('/:quizId/results', Auth_middlewares_1.Authenticate, quizResult_controller_1.getQuizResultsByQuiz);
// //Get a specific quiz result
// router.get('/results/:quizResultId', Authenticate, getQuizResultById);
exports.default = router;
//# sourceMappingURL=quizResult.routes.js.map