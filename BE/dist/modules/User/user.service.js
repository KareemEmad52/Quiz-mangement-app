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
exports.UserService = void 0;
const quizResult_repository_1 = require("../../common/Respositories/quizResult.repository");
const errorHandler_1 = require("../../middlewares/errorHandler");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    AllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository.getAllUsers();
            return users;
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.getUserById(id);
            return user;
        });
    }
    updateUser(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.userRepository.getUserById(id);
            if (!user)
                throw new Error("User not found");
            const updatedUser = yield this.userRepository.updateOne(id, body);
            return updatedUser;
        });
    }
    deleteUser(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1: Ensure the user exists
                const user = yield this.userRepository.getUserById(id);
                if (!user) {
                    throw new Error("User not found");
                }
                const quizResultRepository = new quizResult_repository_1.QuizResultRepository();
                const deletedResults = yield quizResultRepository.deleteQuizSubmissionByUser(userId);
                if (!deletedResults)
                    new errorHandler_1.AppError("Failed to delete quiz submissions", 400);
                const deletedUser = yield this.userRepository.deleteOne(userId);
                if (!deletedUser)
                    new errorHandler_1.AppError("Failed to delete user", 400);
                return deletedUser;
            }
            catch (error) {
                console.error("Error in deleteUser:", error.message);
                throw new errorHandler_1.AppError(`Deletion failed: ${error.message}`, 400);
            }
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map