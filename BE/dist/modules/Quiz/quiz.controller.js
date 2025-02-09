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
exports.deleteSpecificQuiz = exports.updateSpecificQuiz = exports.getSpecificQuiz = exports.getAllQuizes = exports.createQuiz = void 0;
const cjs_1 = require("http-status-codes/build/cjs");
const errorHandler_1 = require("../../middlewares/errorHandler");
const quiz_service_1 = require("./quiz.service");
const quiz_repository_1 = require("../../common/Respositories/quiz.repository");
const user_repository_1 = require("../../common/Respositories/user.repository");
const question_repository_1 = require("../../common/Respositories/question.repository");
const quizRepository = new quiz_repository_1.QuizRepository();
const userRepository = new user_repository_1.UserRepository();
const questionRepository = new question_repository_1.QuestionRepository();
const quizService = new quiz_service_1.QuizService(quizRepository, userRepository, questionRepository);
exports.createQuiz = (0, errorHandler_1.CatchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.teacher = req.user.id;
    const { quiz } = yield quizService.createQuiz(req.body);
    res.status(cjs_1.StatusCodes.OK).json({
        message: (0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK),
        status: (0, cjs_1.getStatusCode)((0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK)),
        data: quiz,
    });
}));
exports.getAllQuizes = (0, errorHandler_1.CatchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => setTimeout(resolve, 2000));
    const Quizzes = yield quizService.getAllQuizes();
    if (!Quizzes)
        throw new errorHandler_1.AppError("Quizzes not found", 404);
    res.status(cjs_1.StatusCodes.OK).json({
        message: (0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK),
        status: (0, cjs_1.getStatusCode)((0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK)),
        data: Quizzes,
    });
}));
exports.getSpecificQuiz = (0, errorHandler_1.CatchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Quiz = yield quizService.getSpecificQuiz(req.params.quizId);
    if (!Quiz)
        throw new errorHandler_1.AppError("Quiz not found", 404);
    res.status(cjs_1.StatusCodes.OK).json({
        message: (0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK),
        status: (0, cjs_1.getStatusCode)((0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK)),
        data: Quiz,
    });
}));
exports.updateSpecificQuiz = (0, errorHandler_1.CatchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedQuiz = yield quizService.updateQuiz(req.params.quizId, req.user.id, req.body);
    if (!updatedQuiz)
        throw new errorHandler_1.AppError("Quiz not found", 404);
    res.status(cjs_1.StatusCodes.OK).json({
        message: (0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK),
        status: (0, cjs_1.getStatusCode)((0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK)),
        data: updatedQuiz,
    });
}));
exports.deleteSpecificQuiz = (0, errorHandler_1.CatchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedQuiz = yield quizService.deleteQuiz(req.params.quizId, req.user.id);
    if (!deletedQuiz.deleted)
        throw new errorHandler_1.AppError("An error occurred while deleting quiz", 404);
    res.status(cjs_1.StatusCodes.OK).json({
        message: (0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK),
        status: (0, cjs_1.getStatusCode)((0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK)),
        data: deletedQuiz,
    });
}));
//# sourceMappingURL=quiz.controller.js.map