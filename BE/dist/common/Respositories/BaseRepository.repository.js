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
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const document = new this.model(data);
            return document.save();
        });
    }
    findOne(where, include) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne(where).populate(include).exec();
        });
    }
    findMany(where, include) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.find(where).populate(include).exec();
        });
    }
    update(where, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOneAndUpdate(where, data, { new: true }).exec();
        });
    }
    delete(where) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOneAndDelete(where).exec();
        });
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.repository.js.map