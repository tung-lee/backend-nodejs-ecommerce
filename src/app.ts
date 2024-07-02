import compression from "compression";
import express, { Request, Response, Express, NextFunction } from "express";
import helmet from "helmet";
import morgan from "morgan";

const app: Express = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db

// init routes
app.get("/", (_req: Request, res: Response, _next: NextFunction) => {
  const strCompress = "Hello World";
  return res.status(200).json({
    message: strCompress.repeat(10000),
  });
});

// handling errors

export default app;
