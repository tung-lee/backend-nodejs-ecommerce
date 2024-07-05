import { model, Schema } from "mongoose";
import { KeyToken } from "../types/keytoken";

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";

const keyTokenSchema = new Schema<KeyToken>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    privateKey: {
      type: String,
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export default model<KeyToken>(DOCUMENT_NAME, keyTokenSchema);
