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
exports.alreadySubmitted = void 0;
const errorHandler_1 = require("../../middlewares/errorHandler");
const quizResult_repository_1 = require("../../common/Respositories/quizResult.repository");
exports.alreadySubmitted = (0, errorHandler_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizId } = req.params;
    const userId = req.user.id;
    const quizResultRepo = new quizResult_repository_1.QuizResultRepository();
    const quizzies = yield quizResultRepo.findUnique({ quiz: quizId, student: userId });
    if (quizzies)
        next(new errorHandler_1.AppError("You have already submitted this quiz", 400));
    next();
}));
//# sourceMappingURL=quizResult.middleware.js.map