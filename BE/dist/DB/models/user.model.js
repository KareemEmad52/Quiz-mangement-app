"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const types_1 = require("../../common/types/types");
const schema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
    gender: {
        type: String,
        enum: types_1.UserGender,
        required: true,
        default: types_1.UserGender.MALE
    },
    role: {
        type: String,
        enum: types_1.UserRole,
        default: types_1.UserRole.USER
    },
    QuizzesResult: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "QuizSubmission"
    }
}, { timestamps: true });
exports.userModel = mongoose_1.default.model('User', schema);
//# sourceMappingURL=user.model.js.map