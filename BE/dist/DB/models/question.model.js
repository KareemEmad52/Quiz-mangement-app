"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    choices: {
        type: [String],
        required: true
    },
    correctAnswer: {
        type: String,
        required: true
    },
    quizId: {
        type: String,
        required: true
    }
});
exports.questionModel = mongoose_1.default.model("Question", schema);
//# sourceMappingURL=question.model.js.map