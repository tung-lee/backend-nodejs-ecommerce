import { Router } from "express";
import accessRouter from "./access";
import productRouter from "./product";
import { checkApiKey, checkPermission } from "../auth/checkAuth";
import { Permission } from "../types/apikey";

const router = Router();

// check api key
router.use(checkApiKey);

// check permission
router.use(checkPermission(Permission.A));

router.use("/v1/api", accessRouter);
router.use("/v1/api/product", productRouter);

export default router;
