"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizModel = exports.quizSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const types_1 = require("../../common/types/types");
exports.quizSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(types_1.StatusEnums),
    },
    deadline: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value >= new Date();
            },
            message: 'Deadline must be a future date',
        },
    },
    noOfQuests: {
        type: Number,
        required: true,
        default: 0,
    },
    startTime: {
        type: Date,
        required: true,
        default: Date.now,
    },
    teacher: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    questions: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Question',
        },
    ],
}, { timestamps: true });
exports.quizModel = mongoose_1.default.model('Quiz', exports.quizSchema);
//# sourceMappingURL=quiz.model.js.map