import compression from "compression";
import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";

import { checkOverload } from "./helpers/check_connect";
import router from "./routes";

require("dotenv").config();

const app: Express = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
require("./db/init_mongodb");
checkOverload();

// init routes
app.use("", router);

// handling errors

export default app;
