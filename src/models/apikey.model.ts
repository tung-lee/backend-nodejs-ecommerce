import { model, Schema } from "mongoose";
import { ApiKey, Permission } from "../types/apikey";

const DOCUMENT_NAME = "ApiKey";
const COLLECTION_NAME = "ApiKeys";

const apiKeySchema = new Schema<ApiKey>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: [Permission.A, Permission.B, Permission.C],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export default model<ApiKey>(DOCUMENT_NAME, apiKeySchema);
