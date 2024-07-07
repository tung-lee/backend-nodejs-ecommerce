import { model, Schema } from "mongoose";
import { Clothing, Electronics, Product, ProductType } from "../types/product";

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema<Product>(
  {
    name: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        ProductType.ELECTRONICS,
        ProductType.CLOTHING,
        ProductType.FURNITURE,
      ],
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// define product type = clothing
const clothingSchema = new Schema<Clothing>(
  {
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    material: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "Clothings",
  }
);

// define product type = electronics
const electronicsSchema = new Schema<Electronics>(
  {
    manufacturer: {
      type: String,
      required: true,
    },
    model: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "Electronics",
  }
);

export const ProductModel = model<Product>(DOCUMENT_NAME, productSchema);
export const ClothingModel = model<Clothing>("Clothing", clothingSchema);
export const ElectronicsModel = model<Electronics>(
  "Electronic",
  electronicsSchema
);
