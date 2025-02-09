import { Request, Response } from "express";
import { StatusCodes, getReasonPhrase, getStatusCode } from "http-status-codes";
import {  AddUserDto, LoginDto } from "../../common/types/types";
import { UserService } from "./Auth.service";
import { UserRepository } from "../../common/Respositories/user.repository";
import { CatchAsyncError } from "../../middlewares/errorHandler";

const userService = new UserService(new UserRepository());

export const register = CatchAsyncError(async (req: Request<{}, {}, AddUserDto>, res: Response) => {    
    const newUser = await userService.register(req.body);
    res.status(StatusCodes.CREATED).json({message: getReasonPhrase(StatusCodes.CREATED),status: getStatusCode(getReasonPhrase(StatusCodes.CREATED)),data: newUser,
    });
  });

export const login = CatchAsyncError(async (req: Request<{}, {}, LoginDto>, res: Response) => {
    const data = await userService.login(req.body);
    res.status(StatusCodes.OK).json({message: getReasonPhrase(StatusCodes.OK),status: getStatusCode(getReasonPhrase(StatusCodes.OK)),data
    });
  });
