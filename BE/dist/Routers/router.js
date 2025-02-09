"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_routes_1 = __importDefault(require("../modules/Auth/Auth.routes"));
const quiz_routes_1 = __importDefault(require("../modules/Quiz/quiz.routes"));
const quizResult_routes_1 = __importDefault(require("../modules/QuizResult/quizResult.routes"));
const router = (0, express_1.Router)();
router.use('/users', Auth_routes_1.default);
router.use('/quizes', quiz_routes_1.default);
router.use('/results', quizResult_routes_1.default);
exports.default = router;
//# sourceMappingURL=router.js.map