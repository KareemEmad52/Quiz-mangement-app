"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.StatusEnums = exports.UserGender = void 0;
var UserGender;
(function (UserGender) {
    UserGender["MALE"] = "male";
    UserGender["FEMALE"] = "female";
})(UserGender || (exports.UserGender = UserGender = {}));
var StatusEnums;
(function (StatusEnums) {
    StatusEnums["COMPLETED"] = "completed";
    StatusEnums["IN_PROGRESS"] = "in_progress";
    StatusEnums["COMING_SOON"] = "coming_Soon";
})(StatusEnums || (exports.StatusEnums = StatusEnums = {}));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
//# sourceMappingURL=types.js.map