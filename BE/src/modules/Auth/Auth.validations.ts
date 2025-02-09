// src/validators/authValidator.ts
import * as yup from "yup";
import {UserGender, UserRole} from "../../common/types/types";

export const registerSchema = yup.object({
  body: yup.object({
    name: yup.string().required("Name is required").min(3, "Name should have at least 3 characters"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters long"),
    gender: yup.string().oneOf([UserGender.MALE, UserGender.FEMALE], "Gender must be one of ['male','female']").required("Gender is required"),
    role: yup.string().oneOf([UserRole.ADMIN, UserRole.USER], "Role must be one of ['admin','user']").optional(),
  }).noUnknown(true, 'Unknown field: ${unknown}'),
  headers: yup.object().optional(),
  params : yup.object().optional()
});

export const loginSchema = yup.object({
  body: yup.object({
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters long"),
  }).noUnknown(true, 'Unknown field: ${unknown}'),
  headers: yup.object({}).optional(),
  params : yup.object().optional()
});

