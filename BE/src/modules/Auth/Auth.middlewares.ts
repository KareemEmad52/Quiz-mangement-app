import { NextFunction, Request, Response } from "express";
import { AppError, CatchAsyncError } from "../../middlewares/errorHandler";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../common/Respositories/user.repository";
import {User} from "../../common/types/types";

export const Authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Unauthorized", 403));
    }
    next();
  };
}



export const Authenticate = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("token");

    if (!token) {
      return next(new AppError("Unauthenticated. No token provided", 401));
    }

    try {
      const userRepository = new UserRepository();
      const userPayload = jwt.verify(
        token,
        process.env.TOKEN_SECRET_KEY as string
      ) as { id: string };

      const user: Partial<User> | null = await userRepository.findUserById(
        userPayload.id
      );
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      req.user = user;
      next();
    } catch (error: any) {
      const message =
        error.name === "TokenExpiredError"
          ? "Token has expired"
          : "Invalid token";
      return next(new AppError(message, 498));
    }
  }
);
