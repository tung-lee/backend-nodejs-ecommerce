import { NextFunction, Request, Response } from "express";
import AccessService from "../services/access.service";
import { LoginRequest, SignUpRequest } from "../types/request";
import { CreatedResponse, SuccessResponse } from "../core/success.response";

class AccessController {
  static logout = async (req: Request, res: Response, _next: NextFunction) => {
    console.log(`[POST] /shop/logout`, req.body);
    // @ts-ignore - fix later
    let result = await AccessService.logout(req.keyStore);
    return new SuccessResponse({
      message: "Logout OK!",
      metadata: result,
    }).send(res);
  };

  static login = async (req: Request, res: Response, _next: NextFunction) => {
    console.log(`[POST] /shop/login`, req.body);
    let data: LoginRequest = {
      email: req.body.email,
      password: req.body.password,
      refreshToken: req.body.refreshToken,
    };
    let result = await AccessService.login(data);
    return new SuccessResponse({
      message: "Login OK!",
      metadata: result,
    }).send(res);
  };

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
