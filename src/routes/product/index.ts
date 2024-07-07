import { Router } from "express";
import myAsyncHandler from "../../helpers/my_async_handler";
import { authentication } from "../../auth/authUtils";
import ProductController from "../../controllers/product.controller";

const router = Router();

// authentication
router.use(myAsyncHandler(authentication));

router.post("", myAsyncHandler(ProductController.createProduct));

export default router;
