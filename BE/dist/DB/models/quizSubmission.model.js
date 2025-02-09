"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizSubmissionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const answerSchema = new mongoose_1.default.Schema({
    question: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
});
const quizSubmissionSchema = new mongoose_1.default.Schema({
    student: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    quiz: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
    },
    answers: [answerSchema],
    score: {
        type: Number,
        default: 0,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["pending", "submitted", "graded"],
        default: "submitted",
    },
});
exports.QuizSubmissionModel = mongoose_1.default.model("QuizSubmission", quizSubmissionSchema);
//# sourceMappingURL=quizSubmission.model.js.map