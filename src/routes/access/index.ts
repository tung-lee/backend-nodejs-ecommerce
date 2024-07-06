import { Router } from "express";
import AccessController from "../../controllers/access.controller";
import myAsyncHandler from "../../helpers/my_async_handler";
import { authentication } from "../../auth/authUtils";

const router = Router();

router.post("/shop/sign-up", myAsyncHandler(AccessController.signUp));
router.post("/shop/login", myAsyncHandler(AccessController.login));

// authentication
router.use(myAsyncHandler(authentication));

router.post("/shop/logout", myAsyncHandler(AccessController.logout));
router.post(
  "/shop/handle-refresh-token",
  myAsyncHandler(AccessController.handleRefreshToken)
);

export default router;
