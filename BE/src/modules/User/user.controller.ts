import { Request, Response } from "express";

import { getReasonPhrase, getStatusCode, StatusCodes } from "http-status-codes/build/cjs";
import { AppError, CatchAsyncError } from "../../middlewares/errorHandler";
import { UserRepository } from "../../common/Respositories/user.repository";
import { UserService } from "./user.service";

const userService = new UserService(new UserRepository())

export const getAllUsers = CatchAsyncError (async (req: Request, res: Response) => {
    
    res.status(StatusCodes.OK).json({
        message: getReasonPhrase(StatusCodes.OK),
        status: getStatusCode(getReasonPhrase(StatusCodes.OK)),
        data: await userService.AllUsers(),
    });
})

export const getUserById = CatchAsyncError (async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id)
    if(!user) throw new AppError("User not found",404)
    res.status(StatusCodes.OK).json({
        message: getReasonPhrase(StatusCodes.OK),
        status: getStatusCode(getReasonPhrase(StatusCodes.OK)),
        data: user,
    });
})

export const updateUser = CatchAsyncError (async (req: Request, res: Response) => {
    const user = await userService.updateUser(req.user.id, req.body)
    if(!user) throw new AppError("User not found",404)
    res.status(StatusCodes.OK).json({
        message: getReasonPhrase(StatusCodes.OK),
        status: getStatusCode(getReasonPhrase(StatusCodes.OK)),
        data: user,
    });
})

export const deleteUser = CatchAsyncError(async (req: Request, res: Response) => {
    const user = await userService.deleteUser(req.user.id , req.params.id)
    if(!user) throw new AppError("faild to delete",404)
    res.status(StatusCodes.OK).json({
        message: getReasonPhrase(StatusCodes.OK),
        status: getStatusCode(getReasonPhrase(StatusCodes.OK)),
        data: user,
    });
})