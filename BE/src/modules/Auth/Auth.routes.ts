import { Router } from "express";
import { login, register } from "./Auth.controller";
import { validate } from "../../middlewares/ValidateRequests";
import { loginSchema, registerSchema } from "./Auth.validations";
import userRouter from '../User/user.routes'
const router = Router();

router.post("/register", validate(registerSchema), register);


router.post("/login", validate(loginSchema), login);

router.use(userRouter)

export default router;
