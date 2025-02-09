"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_middlewares_1 = require("../Auth/Auth.middlewares");
const ValidateRequests_1 = require("../../middlewares/ValidateRequests");
const user_controller_1 = require("./user.controller");
const user_validations_1 = require("./user.validations");
// import { hasPermission, isTaskExist } from "./tasks.middlewares";
const router = (0, express_1.Router)();
router.get('/', Auth_middlewares_1.Authenticate, (0, Auth_middlewares_1.Authorize)("admin"), user_controller_1.getAllUsers);
router.get('/:id', Auth_middlewares_1.Authenticate, (0, ValidateRequests_1.validate)(user_validations_1.getUserByIdSchema), user_controller_1.getUserById);
exports.default = router;
//# sourceMappingURL=user.routes.js.map