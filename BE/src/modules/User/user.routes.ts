import { Router } from "express";
import { Authenticate, Authorize } from "../Auth/Auth.middlewares";
import { validate } from "../../middlewares/ValidateRequests";
import { getAllUsers, getUserById } from "./user.controller";
import { getUserByIdSchema } from "./user.validations";
// import { hasPermission, isTaskExist } from "./tasks.middlewares";

const router = Router()

router.get('/', Authenticate,Authorize("admin") ,getAllUsers)
router.get('/:id', Authenticate,validate(getUserByIdSchema), getUserById)


export default router