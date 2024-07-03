import { model, Schema } from "mongoose";
import { Shop, ShopStatus } from "../types";

const DOCUMENT_NAME = "Shop";
const COLLECTION_NAME = "Shops";

const shopSchema = new Schema<Shop>(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    email: { type: String, unique: true, trim: true },
    password: { type: String, required: true },
    status: {
      type: String,
      enum: [ShopStatus.ACTIVE, ShopStatus.INACTIVE],
      default: ShopStatus.INACTIVE,
    },
    verify: { type: Boolean, default: false },
    roles: { type: [String], default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export default model<Shop>(DOCUMENT_NAME, shopSchema);
