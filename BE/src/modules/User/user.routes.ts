import { Router } from "express";
import { Authenticate, Authorize } from "../Auth/Auth.middlewares";
import { validate } from "../../middlewares/ValidateRequests";
import { deleteUser, getAllUsers, getUserById, updateUser } from "./user.controller";
import { deleteUserSchame, getUserByIdSchema, updateUserSchema } from "./user.validations";

const router = Router();

router.get("/", Authenticate, Authorize("admin"), getAllUsers);
router.get("/:id", Authenticate, validate(getUserByIdSchema), getUserById);


router.put("/", Authenticate, validate(updateUserSchema), updateUser);
router.delete("/:id", Authenticate, Authorize("admin"),validate(deleteUserSchame), deleteUser);

export default router;
