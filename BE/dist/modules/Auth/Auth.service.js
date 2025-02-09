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
exports.UserService = void 0;
const errorHandler_1 = require("../../middlewares/errorHandler");
const http_status_codes_1 = require("http-status-codes");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    register(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExist = yield this.userRepository.findByEmail(user.email);
            if (userExist)
                throw new errorHandler_1.AppError("Email already exist", http_status_codes_1.StatusCodes.CONFLICT);
            const hashedPassword = yield bcrypt_1.default.hash(user.password, +process.env.HASS_SALTS);
            user.password = hashedPassword;
            return this.userRepository.addUser(user);
        });
    }
    login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExist = yield this.userRepository.findByEmail(user.email);
            if (!userExist)
                throw new errorHandler_1.AppError("Invalid Credentials", http_status_codes_1.StatusCodes.NOT_FOUND);
            // const isMatch = await bcrypt.compare(user.password, userExist.password);
            const isMatch = yield bcrypt_1.default.compare(user.password, userExist.password);
            if (!isMatch)
                throw new errorHandler_1.AppError("Invalid Credentials", http_status_codes_1.StatusCodes.NOT_FOUND);
            const { id, name, email, gender, role } = userExist;
            const token = jsonwebtoken_1.default.sign({ id, name, email, gender, role }, process.env.TOKEN_SECRET_KEY);
            return { token, user: { id, name, email, gender, role } };
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=Auth.service.js.map