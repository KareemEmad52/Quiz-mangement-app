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
exports.QuizService = void 0;
const errorHandler_1 = require("../../middlewares/errorHandler");
const cjs_1 = require("http-status-codes/build/cjs");
class QuizService {
    constructor(quizRepository, userRepository, questionRepository) {
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
    }
    // teacher role only can create the quiz
    createQuiz(createQuizDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const quiz = yield this.quizRepository.createQuiz(createQuizDto);
            return { quiz };
        });
    }
    getNumberOfQuestions(quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.questionRepository.findMany({ quizId })).length;
        });
    }
    // all roles  can get the quiz
    getAllQuizesOfSpecificTeacher(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserById(teacherId);
            if (!user)
                throw new errorHandler_1.AppError("user not found", cjs_1.StatusCodes.NOT_FOUND);
            const quiz = yield this.quizRepository.findMany({ teacher: teacherId });
            return quiz;
        });
    }
    // all roles  can get the quiz
    getAllQuizes() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.quizRepository.findMany({}, "questions");
            return user;
        });
    }
    // all roles  can get the quiz
    getSpecificQuiz(quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            const quiz = yield this.quizRepository.findOne({ _id: quizId }, "questions");
            if (!quiz)
                throw new errorHandler_1.AppError("Quiz not found", cjs_1.StatusCodes.NOT_FOUND);
            return quiz;
        });
    }
    // teacher role only can update the quiz
    // async updateQuiz(quizId: string, authenticatedUserId: string, updatedData: Partial<Quiz>) {
    //     const quiz = await this.quizRepository.findOne({ id: quizId });
    //     if (!quiz) throw new AppError("quiz not found", StatusCodes.NOT_FOUND);
    //     if (authenticatedUserId != quiz.teacher.toString()) throw new AppError("quiz not found", StatusCodes.NOT_ACCEPTABLE)
    //     const updatedQuiz = await this.quizRepository.update({ id: quizId }, updatedData)
    //     return updatedQuiz;
    // }
    // teacher role only can update the quiz
    // async deleteQuiz(quizId: string, authenticatedUserId: string) {
    //     const quiz = await this.quizRepository.findOne({ id: quizId });
    //     if (!quiz) throw new AppError("quiz not found", StatusCodes.NOT_FOUND);
    //     if (authenticatedUserId != quiz.teacher) throw new AppError("quiz not found", StatusCodes.NOT_ACCEPTABLE)
    //     await this.quizRepository.delete({ id: quizId })
    //     return true;
    // }
    // teacher role only can update the quiz
    updateQuiz(quizId, authenticatedUserId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const quiz = yield this.quizRepository.findOne({ _id: quizId });
            if (!quiz)
                throw new errorHandler_1.AppError("quiz not found", cjs_1.StatusCodes.NOT_FOUND);
            if (authenticatedUserId != quiz.teacher.toString())
                throw new errorHandler_1.AppError("Teacher only can update the quiz", cjs_1.StatusCodes.FORBIDDEN);
            const updatedQuiz = yield this.quizRepository.updateQuiz(quizId, updatedData);
            return updatedQuiz;
        });
    }
    deleteQuiz(quizId, authenticatedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const quiz = yield this.quizRepository.findOne({ _id: quizId });
            if (!quiz)
                throw new errorHandler_1.AppError("quiz not found", cjs_1.StatusCodes.NOT_FOUND);
            if (authenticatedUserId != quiz.teacher.toString())
                throw new errorHandler_1.AppError("Teacher only can delete the quiz", cjs_1.StatusCodes.FORBIDDEN);
            const deletedQuiz = yield this.quizRepository.deleteQuiz(quizId);
            return {
                deleted: true
            };
        });
    }
}
exports.QuizService = QuizService;
//# sourceMappingURL=quiz.service.js.map