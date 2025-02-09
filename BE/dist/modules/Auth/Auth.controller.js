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
exports.login = exports.register = void 0;
const http_status_codes_1 = require("http-status-codes");
const Auth_service_1 = require("./Auth.service");
const user_repository_1 = require("../../common/Respositories/user.repository");
const errorHandler_1 = require("../../middlewares/errorHandler");
const userService = new Auth_service_1.UserService(new user_repository_1.UserRepository());
exports.register = (0, errorHandler_1.CatchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield userService.register(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ message: (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.CREATED), status: (0, http_status_codes_1.getStatusCode)((0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.CREATED)), data: newUser,
    });
}));
exports.login = (0, errorHandler_1.CatchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield userService.login(req.body);
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.OK), status: (0, http_status_codes_1.getStatusCode)((0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.OK)), data
    });
}));
//# sourceMappingURL=Auth.controller.js.map