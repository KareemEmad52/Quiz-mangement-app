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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticate = exports.Authorize = void 0;
const errorHandler_1 = require("../../middlewares/errorHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../../common/Respositories/user.repository");
const Authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new errorHandler_1.AppError("Unauthorized", 403));
        }
        next();
    };
};
exports.Authorize = Authorize;
exports.Authenticate = (0, errorHandler_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header("token");
    if (!token) {
        return next(new errorHandler_1.AppError("Unauthenticated. No token provided", 401));
    }
    try {
        const userRepository = new user_repository_1.UserRepository();
        const userPayload = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET_KEY);
        const user = yield userRepository.findUserById(userPayload.id);
        if (!user) {
            return next(new errorHandler_1.AppError("User not found", 404));
        }
        req.user = user;
        next();
    }
    catch (error) {
        const message = error.name === "TokenExpiredError"
            ? "Token has expired"
            : "Invalid token";
        return next(new errorHandler_1.AppError(message, 498));
    }
}));
//# sourceMappingURL=Auth.middlewares.js.map