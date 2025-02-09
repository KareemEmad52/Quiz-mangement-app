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
exports.DB_CONNECTION = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DB_CONNECTION = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connectionString = process.env.DBCONNECTION;
        const connection = yield mongoose_1.default.connect(connectionString);
        console.log("Database connected successfully");
        return connection;
    }
    catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
});
exports.DB_CONNECTION = DB_CONNECTION;
//# sourceMappingURL=DB.connection.js.map