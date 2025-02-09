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
exports.getUserById = exports.getAllUsers = void 0;
const cjs_1 = require("http-status-codes/build/cjs");
const errorHandler_1 = require("../../middlewares/errorHandler");
const user_repository_1 = require("../../common/Respositories/user.repository");
const user_service_1 = require("./user.service");
const userService = new user_service_1.UserService(new user_repository_1.UserRepository());
exports.getAllUsers = (0, errorHandler_1.CatchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(cjs_1.StatusCodes.OK).json({
        message: (0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK),
        status: (0, cjs_1.getStatusCode)((0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK)),
        data: yield userService.AllUsers(),
    });
}));
exports.getUserById = (0, errorHandler_1.CatchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService.getUserById(req.params.id);
    if (!user)
        throw new errorHandler_1.AppError("User not found", 404);
    res.status(cjs_1.StatusCodes.OK).json({
        message: (0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK),
        status: (0, cjs_1.getStatusCode)((0, cjs_1.getReasonPhrase)(cjs_1.StatusCodes.OK)),
        data: user,
    });
}));
//# sourceMappingURL=user.controller.js.map