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
exports.QuestionRepository = void 0;
const BaseRepository_repository_1 = require("./BaseRepository.repository");
const question_model_1 = require("../../DB/models/question.model");
class QuestionRepository extends BaseRepository_repository_1.BaseRepository {
    constructor() {
        super(question_model_1.questionModel); // Pass the Mongoose model to the BaseRepository
    }
    insertQuestions(questions) {
        return __awaiter(this, void 0, void 0, function* () {
            // Use Mongoose's `insertMany` to insert multiple documents
            return this.model.insertMany(questions);
        });
    }
}
exports.QuestionRepository = QuestionRepository;
//# sourceMappingURL=question.repository.js.map