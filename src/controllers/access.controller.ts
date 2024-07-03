import { NextFunction, Request, Response } from "express";

class AccessController {
  static signUp = async (req: Request, res: Response, next: NextFunction) =>{
    try {
      console.log(`[POST] /shop/sign-up`, req.body);
      return res.status(201).json({
        code: "20001",
        metadata: {
          userId: 1,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export default AccessController;
