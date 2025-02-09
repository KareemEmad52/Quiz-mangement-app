import { NextFunction, Request, Response } from "express";

export const CatchAsyncError = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((error) => next(error));
  };
};


export class AppError extends Error {
  status: number;  

  constructor(message: string, status: number) {
    super(message); 
    this.status = status;
    this.name = this.constructor.name; 
    Error.captureStackTrace(this, this.constructor);
  }
}
