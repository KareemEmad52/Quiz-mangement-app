"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_controller_1 = require("./Auth.controller");
const ValidateRequests_1 = require("../../middlewares/ValidateRequests");
const Auth_validations_1 = require("./Auth.validations");
const user_routes_1 = __importDefault(require("../User/user.routes"));
const router = (0, express_1.Router)();
router.post("/register", (0, ValidateRequests_1.validate)(Auth_validations_1.registerSchema), Auth_controller_1.register);
router.post("/login", (0, ValidateRequests_1.validate)(Auth_validations_1.loginSchema), Auth_controller_1.login);
router.use(user_routes_1.default);
exports.default = router;
//# sourceMappingURL=Auth.routes.js.map