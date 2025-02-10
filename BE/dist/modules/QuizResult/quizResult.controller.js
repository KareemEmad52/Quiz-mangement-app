"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSubmitions = exports.getQuizResultsByQuiz = exports.getQuizResultsByUser = exports.submitQuiz = void 0;
const cjs_1 = require("http-status-codes/build/cjs");
const errorHandler_1 = require("../../middlewares/errorHandler");
const quiz_repository_1 = require("../../common/Respositories/quiz.repository");
const user_repository_1 = require("../../common/Respositories/user.repository");
const question_repository_1 = require("../../common/Respositories/question.repository");
const quizResult_service_1 = require("./quizResult.service");
const quizResult_repository_1 = require("../../common/Respositories/quizResult.repository");
const quizRepository = new quiz_repository_1.QuizRepository();
const userRepository = new user_repository_1.UserRepository();
const questionRepository = new question_repository_1.QuestionRepository();
const quizResultRepository = new quizResult_repository_1.QuizResultRepository();
const quizResultService = new quizResult_service_1.QuizResultService(quizRepository, userRepository, questionRepository, quizResultRepository);
exports.submitQuiz = (0, errorHandler_1.CatchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizId } = req.params;
    const userId = req.user.id;
    const { answers } = req.body;
    // Call the service to submit the quiz
    const quizResult = yield quizResultService.submitQuiz(quizId, userId, answers);
    // Send the response
    res.status(cjs_1.StatusCodes.OK).json({
        message: (0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK),
        status: cjs_1.StatusCodes.OK,
        data: quizResult,
    });
}));
exports.getQuizResultsByUser = (0, errorHandler_1.CatchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield quizResultService.getQuizResultsByUser(req.user.id);
    if (!results)
        throw new errorHandler_1.AppError("quiz result not found", 404);
    res.status(cjs_1.StatusCodes.OK).json({
        message: (0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK),
        status: (0, cjs_1.getStatusCode)((0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK)),
        data: results,
    });
}));
// Get User's Quiz  by a QuizID
exports.getQuizResultsByQuiz = (0, errorHandler_1.CatchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield quizResultService.getQuizResultsByQuiz(req.params.quizId, req.user.id);
    if (!results)
        throw new errorHandler_1.AppError("quiz result not found", 404);
    res.status(cjs_1.StatusCodes.OK).json({
        message: (0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK),
        status: (0, cjs_1.getStatusCode)((0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK)),
        data: results,
    });
}));
exports.checkSubmitions = (0, errorHandler_1.CatchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(cjs_1.StatusCodes.OK).json({
        message: (0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK),
        status: cjs_1.StatusCodes.OK,
    });
}));
//# sourceMappingURL=quizResult.controller.js.map