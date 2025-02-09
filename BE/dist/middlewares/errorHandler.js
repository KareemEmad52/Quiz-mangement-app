"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = exports.CatchAsyncError = void 0;
const CatchAsyncError = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => next(error));
    };
};
exports.CatchAsyncError = CatchAsyncError;
class AppError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
//# sourceMappingURL=errorHandler.js.map