"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_middlewares_1 = require("../Auth/Auth.middlewares");
const ValidateRequests_1 = require("../../middlewares/ValidateRequests");
const user_controller_1 = require("./user.controller");
const user_validations_1 = require("./user.validations");
const router = (0, express_1.Router)();
router.get("/", Auth_middlewares_1.Authenticate, (0, Auth_middlewares_1.Authorize)("admin"), user_controller_1.getAllUsers);
router.get("/:id", Auth_middlewares_1.Authenticate, (0, ValidateRequests_1.validate)(user_validations_1.getUserByIdSchema), user_controller_1.getUserById);
router.put("/", Auth_middlewares_1.Authenticate, (0, ValidateRequests_1.validate)(user_validations_1.updateUserSchema), user_controller_1.updateUser);
router.delete("/:id", Auth_middlewares_1.Authenticate, (0, Auth_middlewares_1.Authorize)("admin"), (0, ValidateRequests_1.validate)(user_validations_1.deleteUserSchame), user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map