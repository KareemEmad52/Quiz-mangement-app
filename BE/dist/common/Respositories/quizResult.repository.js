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
exports.QuizResultRepository = void 0;
const quizSubmission_model_1 = require("../../DB/models/quizSubmission.model");
const BaseRepository_repository_1 = require("./BaseRepository.repository");
class QuizResultRepository extends BaseRepository_repository_1.BaseRepository {
    constructor() {
        super(quizSubmission_model_1.QuizSubmissionModel);
    }
    findUnique(where) {
        return __awaiter(this, void 0, void 0, function* () {
            return quizSubmission_model_1.QuizSubmissionModel.findOne(where).exec();
        });
    }
    createQuizResult(quizId, userId, score, answers) {
        return __awaiter(this, void 0, void 0, function* () {
            const quizSubmission = new quizSubmission_model_1.QuizSubmissionModel({
                student: userId,
                quiz: quizId,
                score,
                answers: answers.map(answer => ({
                    question: answer.questionId,
                    answer: answer.selected,
                })),
                status: 'graded',
            });
            return quizSubmission.save();
        });
    }
    getQuizResultsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return quizSubmission_model_1.QuizSubmissionModel.find({ student: userId })
                .populate({
                path: 'quiz',
                populate: {
                    path: 'questions',
                    model: 'Question',
                },
            })
                .exec();
        });
    }
    getQuizResultsByQuiz(quizId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return quizSubmission_model_1.QuizSubmissionModel.find({ quiz: quizId, student: userId })
                .populate({
                path: 'quiz',
                select: "title  duration noOfQuests description status ",
            }).populate({
                path: 'answers.question',
                select: 'title choices correctAnswer -_id',
            })
                .exec();
        });
    }
    getQuizResultById(quizResultId) {
        return __awaiter(this, void 0, void 0, function* () {
            return quizSubmission_model_1.QuizSubmissionModel.findById(quizResultId)
                .populate('quiz')
                .populate('student')
                .exec();
        });
    }
    deleteQuizSubmissionByUser(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return quizSubmission_model_1.QuizSubmissionModel.deleteMany({ student: studentId }).exec();
        });
    }
}
exports.QuizResultRepository = QuizResultRepository;
//# sourceMappingURL=quizResult.repository.js.map