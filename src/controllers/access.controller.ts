import { NextFunction, Request, Response } from "express";
import AccessService from "../services/access.service";
import { SignUpRequest } from "../types/request";
import { CreatedResponse } from "../core/success.response";

class AccessController {
  static signUp = async (req: Request, res: Response, _next: NextFunction) => {
    console.log(`[POST] /shop/sign-up`, req.body);
    let data: SignUpRequest = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    let result = await AccessService.signUp(data);
    return new CreatedResponse({
      message: "Register OK!",
      metadata: result,
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

export default AccessController;
