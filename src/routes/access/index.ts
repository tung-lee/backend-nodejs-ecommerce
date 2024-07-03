import { Router } from "express";
import AccessController from "../../controllers/access.controller";

const router = Router();

router.post("/shop/sign-up", AccessController.signUp);

export default router;
