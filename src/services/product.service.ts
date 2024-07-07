import { Schema } from "mongoose";
import {
  clothingModel,
  electronicsModel,
  productModel,
} from "../models/product.model";

import { Product as IProduct, ProductType } from "../types/product";
import { BadRequestError } from "../core/error.response";

// Factory class for creating products
class ProductFactory {
  /*
    type: ProductType
    payload
  */

  static createProduct(payload: IProduct) {
    switch (payload.type) {
      case ProductType.CLOTHING:
        return new Clothing(payload).create();
      case ProductType.ELECTRONICS:
        return new Electronics(payload).create();
      default:
        throw new BadRequestError(`Invalid product type ${payload.type}`);
    }
  }
}

// Base product class
class Product implements IProduct {
  name: string;
  thumbnail: string;
  description: string;
  price: number;
  quantity: number;
  type: ProductType;
  shopId: Schema.Types.ObjectId;
  attributes: any;

  constructor(product: IProduct) {
    this.name = product.name;
    this.thumbnail = product.thumbnail;
    this.description = product.description;
    this.price = product.price;
    this.quantity = product.quantity;
    this.type = product.type;
    this.shopId = product.shopId;
    this.attributes = product.attributes;
  }

  async create() {
    return await productModel.create(this);
  }
}

// Subclass for clothing
class Clothing extends Product {
  constructor(product: IProduct) {
    super(product);
  }

  async create() {
    let newClothing = await clothingModel.create(this.attributes); // Create clothing document in the db
    if (!newClothing) throw new BadRequestError("Clothing creation failed");
    const newProduct = super.create();
    if (!newProduct) throw new BadRequestError("Product creation failed");
    return newProduct;
  }
}

// Subclass for electronics
class Electronics extends Product {
  constructor(product: IProduct) {
    super(product);
  }

  async create() {
    let newElectronic = await electronicsModel.create(this.attributes); // Create electronics document in the db
    if (!newElectronic)
      throw new BadRequestError("Electronics creation failed");
    const newProduct = super.create();
    if (!newProduct) throw new BadRequestError("Product creation failed");
    return newProduct;
  }
}

export default ProductFactory;
