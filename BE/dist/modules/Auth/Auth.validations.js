"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
// src/validators/authValidator.ts
const yup = __importStar(require("yup"));
const types_1 = require("../../common/types/types");
exports.registerSchema = yup.object({
    body: yup.object({
        name: yup.string().required("Name is required").min(3, "Name should have at least 3 characters"),
        email: yup.string().email("Invalid email format").required("Email is required"),
        password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters long"),
        gender: yup.string().oneOf([types_1.UserGender.MALE, types_1.UserGender.FEMALE], "Gender must be one of ['male','female']").required("Gender is required"),
        role: yup.string().oneOf([types_1.UserRole.ADMIN, types_1.UserRole.USER], "Role must be one of ['admin','user']").optional(),
    }).noUnknown(true, 'Unknown field: ${unknown}'),
    headers: yup.object().optional(),
    params: yup.object().optional()
});
exports.loginSchema = yup.object({
    body: yup.object({
        email: yup.string().email("Invalid email format").required("Email is required"),
        password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters long"),
    }).noUnknown(true, 'Unknown field: ${unknown}'),
    headers: yup.object({}).optional(),
    params: yup.object().optional()
});
//# sourceMappingURL=Auth.validations.js.map