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
exports.UserRepository = void 0;
const user_model_1 = require("../../DB/models/user.model");
class UserRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.userModel.findOne({ email }).exec();
        });
    }
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { gender, password, name, email, role } = user;
            const newUser = yield user_model_1.userModel.create({
                gender,
                password,
                name,
                email,
                role,
            });
            return {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                gender: newUser.gender,
            };
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.userModel.findById(id).exec();
            if (!user)
                return null;
            return {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                gender: user.gender,
            };
        });
    }
    findUserByCredentials(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.userModel.findOne({ email, password }).exec();
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_model_1.userModel.find({}).exec();
            return users.map((user) => ({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                gender: user.gender,
            }));
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.userModel.findById(id).exec();
        });
    }
    updateOne(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.userModel.findOneAndUpdate({ _id: id }, data, { new: true }).select('-password').exec();
        });
    }
    deleteOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.userModel.findByIdAndDelete({ _id: id }, { new: true }).select('-password').exec();
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map