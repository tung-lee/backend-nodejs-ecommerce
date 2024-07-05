import { Router } from "express";
import accessRouter from "./access";
import { checkApiKey, checkPermission } from "../auth/checkAuth";
import { Permission } from "../types/apikey";

const router = Router();

// check api key
router.use(checkApiKey);

// check permission
router.use(checkPermission(Permission.A));

router.use("/v1/api", accessRouter);

export default router;
