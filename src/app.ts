import compression from "compression";
import express, { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";

import { checkOverload } from "./helpers/check_connect";
import router from "./routes";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "./core/error.response";

require("dotenv").config();

const app: Express = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init db
require("./db/init_mongodb");
checkOverload();

// init routes
app.use("", router);

// handling errors
app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error = new NotFoundError();
  next(error);
});

// @ts-ignore - fix later
app.use((err, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: err.message || "Internal Server Error",
    // stack: err.stack, // development only
  });
});

export default app;
