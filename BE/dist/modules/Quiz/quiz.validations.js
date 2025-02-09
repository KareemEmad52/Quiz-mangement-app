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
exports.updateDeadLineQuizValidationSchema = exports.updateQuizValidationSchema = exports.quizValidationSchema = exports.IdParamTeacherSchema = exports.IdParamQuizSchema = void 0;
const types_1 = require("../../common/types/types");
const yup = __importStar(require("yup"));
exports.IdParamQuizSchema = yup.object({
    params: yup.object({
        quizId: yup.string().required(),
    }),
});
exports.IdParamTeacherSchema = yup.object({
    params: yup.object({
        teacherId: yup.string().required(),
    }),
});
exports.quizValidationSchema = yup.object().shape({
    body: yup
        .object({
        description: yup
            .string()
            .required("Description is required.")
            .max(255, "Description cannot exceed 255 characters."),
        title: yup
            .string()
            .required("Title is required.")
            .max(100, "Title cannot exceed 100 characters."),
        duration: yup
            .number()
            .typeError("Duration must be a number")
            .required("Duration is required."),
        questions: yup
            .array()
            .of(yup.object({
            title: yup.string().required("Question title is required"),
            choices: yup
                .array()
                .of(yup.string().required("Each choice must be a string"))
                .min(2, "At least two choices are required")
                .required("Choices are required"),
            correctAnswer: yup
                .string()
                .required("Correct answer is required")
                .test("match-choice", "Correct answer must be one of the choices", function (value) {
                return this.parent.choices.includes(value);
            }),
        }))
            .min(1, "At least one question is required")
            .required("Questions are required"),
        startTime: yup
            .mixed()
            .test("is-date", "startTime must be a valid date", (value) => {
            if (!value)
                return false; // Ensure it's not empty
            const date = new Date(value);
            return !isNaN(date.getTime()); // Check if it's a valid Date
        })
            .transform((value) => typeof value === "string" ? new Date(value) : value)
            .required("startTime is required"),
        status: yup
            .string()
            .required("Status is required.")
            .oneOf([
            types_1.StatusEnums.COMING_SOON,
            types_1.StatusEnums.IN_PROGRESS,
            types_1.StatusEnums.COMPLETED,
        ], "Invalid status."),
        deadline: yup
            .string()
            .required("Deadline is required.")
            .test("is-valid-date", "Deadline must be a valid date.", (value) => !isNaN(Date.parse(value))),
    })
        .noUnknown(true, "Unknown fields are not allowed ${unknown}"),
    params: yup
        .object()
        .noUnknown(true, "Unknown fields are not allowed ${unknown}"),
    query: yup
        .object()
        .noUnknown(true, "Unknown fields are not allowed ${unknown}"),
});
exports.updateQuizValidationSchema = yup.object().shape({
    body: yup
        .object()
        .shape({
        description: yup
            .string()
            .max(255, "Description cannot exceed 255 characters")
            .optional(),
        title: yup
            .string()
            .max(100, "Title cannot exceed 100 characters")
            .optional(),
        duration: yup.number().typeError("Duration must be a number").optional(),
        startingTime: yup
            .mixed()
            .test("is-date", "Starting time must be a valid date", (value) => {
            if (!value)
                return true; // Allow null/undefined
            const date = new Date(value);
            return !isNaN(date.getTime());
        })
            .optional(),
        status: yup
            .string()
            .oneOf([
            types_1.StatusEnums.COMING_SOON,
            types_1.StatusEnums.IN_PROGRESS,
            types_1.StatusEnums.COMPLETED,
        ], "Invalid status")
            .optional(),
        deadline: yup
            .string()
            .test("is-valid-date", "Deadline must be a valid date", (value) => {
            if (!value)
                return true; // Allow null/undefined
            return !isNaN(Date.parse(value));
        })
            .optional(),
        noOfQuests: yup
            .number()
            .typeError("Number of questions must be a number")
            .optional(),
        teacher: yup
            .string()
            .matches(/^[0-9a-fA-F]{24}$/, "Teacher ID must be a valid ObjectId")
            .optional(),
        questions: yup
            .array()
            .of(yup.object({
            title: yup.string().optional(),
            choices: yup
                .array()
                .of(yup.string().required("Each choice must be a string"))
                .min(2, "At least two choices are required")
                .optional(),
            correctAnswer: yup
                .string()
                .optional()
                .test("match-choice", "Correct answer must be one of the choices", function (value) {
                return this.parent.choices.includes(value);
            }),
        }))
            .optional(),
        startTime: yup
            .mixed()
            .nullable() // Allow null values
            .optional() // Make the field optional
            .test("is-date", "startTime must be a valid date", // Error message
        (value) => {
            if (!value)
                return true; // Skip validation if value is undefined or null
            const date = new Date(value);
            return !isNaN(date.getTime()); // Check if it's a valid Date
        })
            .transform((value) => {
            if (!value)
                return null; // Handle undefined or null values
            return typeof value === "string" ? new Date(value) : value;
        }),
    })
        .noUnknown(true, "Unknown fields are not allowed ${unknown}"),
    params: yup.object({ quizId: yup.string().required() }),
    query: yup
        .object()
        .noUnknown(true, "Unknown fields are not allowed ${unknown}"),
});
exports.updateDeadLineQuizValidationSchema = yup.object().shape({
    body: yup.object({
        newDeadLine: yup
            .string()
            .required("newDeadLine is required.")
            .test("is-valid-date", "Deadline must be a valid date.", (value) => !isNaN(Date.parse(value))),
    }),
    params: yup.object({ quizId: yup.string().required() }),
});
//# sourceMappingURL=quiz.validations.js.map