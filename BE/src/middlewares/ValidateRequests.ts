// src/middlewares/validateRequest.ts
import { AnySchema } from "yup";
import { Request, Response, NextFunction } from "express";
import { AppError, CatchAsyncError } from "./errorHandler";

  export const validate = (schema: AnySchema) => {
    return CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const response = await schema.validate(
          {
            body: req.body,
            headers: req.headers,
            params: req.params,
          },
          { abortEarly: false, strict: true }
        );
  
        next();
      } catch (err: any) {
        next(new AppError(err.errors.join(' and '), 400)); 
      }
    });
  };
  