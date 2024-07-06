import { NextFunction, Request, Response } from "express";

const myAsyncHandler = (
  asyncFn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    asyncFn(req, res, next).catch(next);
  };
};

export default myAsyncHandler;
