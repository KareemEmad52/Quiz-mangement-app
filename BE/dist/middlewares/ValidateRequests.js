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
exports.validate = void 0;
const errorHandler_1 = require("./errorHandler");
const validate = (schema) => {
    return (0, errorHandler_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield schema.validate({
                body: req.body,
                headers: req.headers,
                params: req.params,
            }, { abortEarly: false, strict: true });
            next();
        }
        catch (err) {
            next(new errorHandler_1.AppError(err.errors.join(' and '), 400));
        }
    }));
};
exports.validate = validate;
//# sourceMappingURL=ValidateRequests.js.map