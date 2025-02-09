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
exports.QuizResultService = void 0;
const errorHandler_1 = require("../../middlewares/errorHandler");
const http_status_codes_1 = require("http-status-codes");
class QuizResultService {
    constructor(quizRepository, userRepository, questionRepository, quizResultRepository) {
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.quizResultRepository = quizResultRepository;
    }
    submitQuiz(quizId, userId, answers) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the quiz exists
            const quiz = yield this.quizRepository.findOne({ _id: quizId });
            if (!quiz)
                throw new errorHandler_1.AppError('Quiz not found', http_status_codes_1.StatusCodes.NOT_FOUND);
            // Check if the user exists
            const user = yield this.userRepository.findUserById(userId);
            if (!user)
                throw new errorHandler_1.AppError('User not found', http_status_codes_1.StatusCodes.NOT_FOUND);
            // Fetch all questions for the quiz
            const questions = yield this.questionRepository.findMany({ quizId: quiz._id });
            if (!questions || questions.length === 0) {
                throw new errorHandler_1.AppError('No questions found for this quiz', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            // Calculate the score
            let score = 0;
            answers.forEach((answer) => {
                const question = questions.find((q) => q.id === answer.questionId);
                if (question && question.correctAnswer === answer.selected) {
                    score += 1;
                }
            });
            // Create the quiz result
            return this.quizResultRepository.createQuizResult(quizId, userId, score, answers);
        });
    }
    getQuizResultsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.quizResultRepository.getQuizResultsByUser(userId);
        });
    }
    getQuizResultsByQuiz(quizId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.quizResultRepository.getQuizResultsByQuiz(quizId, userId);
        });
    }
    getQuizResultById(quizResultId) {
        return __awaiter(this, void 0, void 0, function* () {
            const quizResult = yield this.quizResultRepository.getQuizResultById(quizResultId);
            if (!quizResult)
                throw new errorHandler_1.AppError('Quiz result not found', http_status_codes_1.StatusCodes.NOT_FOUND);
            return quizResult;
        });
    }
}
exports.QuizResultService = QuizResultService;
//# sourceMappingURL=quizResult.service.js.map