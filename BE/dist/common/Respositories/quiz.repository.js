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
exports.QuizRepository = void 0;
const BaseRepository_repository_1 = require("./BaseRepository.repository");
const quiz_model_1 = require("../../DB/models/quiz.model");
const question_model_1 = require("../../DB/models/question.model");
const quizSubmission_model_1 = require("../../DB/models/quizSubmission.model");
const cjs_1 = require("http-status-codes/build/cjs");
const errorHandler_1 = require("../../middlewares/errorHandler");
class QuizRepository extends BaseRepository_repository_1.BaseRepository {
    constructor() {
        super(quiz_model_1.quizModel);
    }
    createQuiz(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start a new session for the transaction
            const session = yield quiz_model_1.quizModel.startSession();
            session.startTransaction();
            try {
                // Step 1: Create the quiz within the transaction
                const [quiz] = yield this.model.create([
                    {
                        description: data.description,
                        title: data.title,
                        duration: data.duration,
                        startingTime: data.startingTime,
                        status: data.status,
                        deadline: data.deadline,
                        teacher: data.teacher,
                        noOfQuests: data.questions.length,
                        questions: [],
                    },
                ], { session } // Pass the session to ensure it's part of the transaction
                );
                // Step 2: Prepare questions with the quiz ID
                const questionsWithQuizId = data.questions.map((question) => (Object.assign(Object.assign({}, question), { quizId: quiz._id })));
                // Step 3: Insert the questions into the Question collection within the same transaction
                const questions = yield question_model_1.questionModel.insertMany(questionsWithQuizId, {
                    session,
                });
                // step 4: Update the quiz with the questions
                quiz.questions = questions.map((question) => question._id);
                yield quiz.save({ session });
                // Step 5: Commit the transaction if everything succeeds
                yield session.commitTransaction();
                // Return the quiz with its questions
                return Object.assign(Object.assign({}, quiz.toObject()), { questions });
            }
            catch (error) {
                // Step 5: Abort the transaction if there's an error
                yield session.abortTransaction();
                console.error("Error creating quiz:", error); // Log the error for debugging
                throw error; // Re-throw the error to notify the caller
            }
            finally {
                // End the session
                yield session.endSession();
            }
        });
    }
    updateQuiz(quizId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start a new session for the transaction
            const session = yield this.model.startSession();
            session.startTransaction();
            try {
                // Step 1: Fetch the existing quiz with its questions
                const quiz = yield this.model
                    .findById(quizId)
                    .populate("questions")
                    .session(session);
                if (!quiz) {
                    yield session.abortTransaction();
                    throw new Error("Quiz not found");
                }
                // Step 2: Update quiz fields (excluding questions for now)
                if (data.title)
                    quiz.title = data.title;
                if (data.description)
                    quiz.description = data.description;
                if (data.duration)
                    quiz.duration = Number(data.duration);
                if (data.startingTime)
                    quiz.startTime = data.startingTime;
                if (data.status)
                    quiz.status = data.status;
                if (data.deadline)
                    quiz.deadline = new Date(data.deadline);
                // Step 3: If questions are being updated, modify existing ones
                if (data.questions && data.questions.length > 0) {
                    for (const q of data.questions) {
                        const questionDocs = yield question_model_1.questionModel
                            .find({
                            _id: { $in: quiz.questions }, // Get only questions related to this quiz
                        })
                            .session(session);
                        const existingQuestion = questionDocs.find((qItem) => qItem._id.toString() === q._id);
                        if (existingQuestion) {
                            // Update existing question
                            Object.assign(existingQuestion, q);
                            yield existingQuestion.save({ session });
                        }
                        else {
                            throw new Error(`Question with ID ${q._id} not found in this quiz`);
                        }
                    }
                }
                // Save the updated quiz
                yield quiz.save({ session });
                // Commit the transaction
                yield session.commitTransaction();
                // Step 4: Fetch the updated quiz with its questions
                const updatedQuiz = yield this.model
                    .findById(quizId)
                    .populate("questions");
                if (!updatedQuiz) {
                    throw new Error("Updated quiz not found");
                }
                const QuizQuestion = yield question_model_1.questionModel
                    .find({
                    _id: { $in: quiz.questions }, // Get only questions related to this quiz
                })
                    .session(session);
                // Return the updated quiz
                return Object.assign(Object.assign({}, updatedQuiz.toObject()), { questions: QuizQuestion });
            }
            catch (error) {
                yield session.abortTransaction();
                console.error("Error updating quiz:", error);
                throw error;
            }
            finally {
                yield session.endSession();
            }
        });
    }
    deleteQuiz(quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.model.startSession();
            session.startTransaction();
            try {
                const quiz = yield this.model.findById(quizId).session(session);
                if (!quiz) {
                    yield session.abortTransaction();
                    throw new Error("Quiz not found");
                }
                yield this.model.deleteOne({ _id: quizId }, { new: true }).session(session);
                yield question_model_1.questionModel.deleteMany({ quizId: quizId }).session(session);
                yield quizSubmission_model_1.QuizSubmissionModel.deleteMany({ quiz: quizId }).session(session);
                yield session.commitTransaction();
            }
            catch (error) {
                yield session.abortTransaction();
                console.error("Error deleting quiz:", error);
            }
            finally {
                yield session.endSession();
            }
            return {
                deleted: true,
            };
        });
    }
    addQuestionToSpecificQuiz(quizId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const questions = yield question_model_1.questionModel.insertMany(data);
            if (!questions)
                throw new errorHandler_1.AppError("Questions not found", cjs_1.StatusCodes.NOT_FOUND);
            const quiz = yield this.model.findById(quizId);
            quiz.questions.push(...questions.map((q) => q._id));
            yield quiz.save();
            return quiz;
        });
    }
    deleteQuestionFromSpecificQuiz(quizId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const quiz = yield this.model.findById(quizId);
            if (!quiz)
                throw new errorHandler_1.AppError("quiz not found", cjs_1.StatusCodes.NOT_FOUND);
            const question = yield question_model_1.questionModel.findByIdAndDelete(data.questionId);
            if (!question)
                throw new errorHandler_1.AppError("Question not found", cjs_1.StatusCodes.NOT_FOUND);
            const index = quiz.questions.indexOf(question._id);
            if (index === -1)
                throw new errorHandler_1.AppError("Question not found", cjs_1.StatusCodes.NOT_FOUND);
            quiz.questions.splice(index, 1);
            yield quiz.save();
            return quiz;
        });
    }
}
exports.QuizRepository = QuizRepository;
//# sourceMappingURL=quiz.repository.js.map