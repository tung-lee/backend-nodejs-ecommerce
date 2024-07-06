import { Router } from "express";
import AccessController from "../../controllers/access.controller";
import { myAsyncHandler } from "../../auth/checkAuth";

const router = Router();

router.post("/shop/sign-up", myAsyncHandler(AccessController.signUp));
router.post("/shop/login", myAsyncHandler(AccessController.login));

export default router;
