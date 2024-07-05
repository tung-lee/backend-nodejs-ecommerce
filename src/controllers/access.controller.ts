import { NextFunction, Request, Response } from "express";
import AccessService from "../services/access.service";
import { SignUpRequest } from "../types/request";

class AccessController {
  static signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(`[POST] /shop/sign-up`, req.body);
      let data: SignUpRequest = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };
      let result = await AccessService.signUp(data);
      return res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };
}

export default AccessController;