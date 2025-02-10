import { UserGender, UserRole } from '../../common/types/types';
import * as yup from 'yup';

export const getUserByIdSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
});
 

export const updateUserSchema = yup.object({
  body: yup.object({
    name: yup.string().optional().min(3, "Name should have at least 3 characters"),
    email: yup.string().email("Invalid email format").optional(),
    password: yup.string().optional().min(6, "Password must be at least 6 characters long"),
    gender: yup.string().oneOf([UserGender.MALE, UserGender.FEMALE], "Gender must be one of ['male','female']").optional(),
    role: yup.string().oneOf([UserRole.ADMIN, UserRole.USER], "Role must be one of ['admin','user']").optional(),
  }).noUnknown(true, 'Unknown field: ${unknown}'),
  headers: yup.object().optional(),
  params : yup.object().optional()
});


export const deleteUserSchame = yup.object({
  body: yup.object().optional().noUnknown(true, 'Unknown field: ${unknown}'),
  headers: yup.object().optional(),
  params : yup.object({
    id: yup.string().required("Student id is required"),
  }).optional().noUnknown(true, 'Unknown field: ${unknown}')
});