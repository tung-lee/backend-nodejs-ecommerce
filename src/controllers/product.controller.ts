import { NextFunction, Request, Response } from "express";
import { CreatedResponse } from "../core/success.response";
import ProductService from "../services/product.service";

class ProductController {
  static createProduct = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.log(`[POST] /shop/handle-refresh-token`, req.body);
    let result = await ProductService.createProduct({
      ...req.body,
      // @ts-ignore - fix later
      shopId: req.shop.shopId,
    });
    return new CreatedResponse({
      message: "Create new product success!",
      metadata: result,
    }).send(res);
  };
}

export default ProductController;
