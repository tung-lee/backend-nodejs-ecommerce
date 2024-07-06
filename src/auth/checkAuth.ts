// middlewares

import { NextFunction, Request, Response } from "express";
import { Header } from "../types/header";
import { StatusCodes } from "http-status-codes";
import ApiKeyService from "../services/apikey.service";
import { ApiKey, Permission } from "../types/apikey";

const checkApiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = await req.headers[Header.X_API_KEY]?.toString();
    if (!apiKey) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Forbidden Error",
      });
    }

    const apiKeyObj = await ApiKeyService.findById(apiKey);
    if (!apiKeyObj) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Forbidden Error",
      });
    }

    // @ts-ignore - fix later
    req.apiKeyObj = apiKeyObj;

    return next();
  } catch (err) {}
};

const checkPermission = (permission: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore - fix later
    let apiKeyObj: ApiKey = req.apiKeyObj;

    if (!apiKeyObj.permissions) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Permission denied",
      });
    }

    console.log(apiKeyObj.permissions);
    const isValidPermission = apiKeyObj.permissions.includes(permission);
    if (!isValidPermission) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Permission denied",
      });
    }

    return next();
  };
};

export { checkApiKey, checkPermission };
