import { Document, ObjectId } from "mongoose";

export interface KeyToken extends Document {
  shopId: ObjectId;
  publicKey: string;
  refreshToken: string[];
}
