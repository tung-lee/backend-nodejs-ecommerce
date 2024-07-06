import { Document, ObjectId } from "mongoose";

export interface KeyToken extends Document {
  shopId: ObjectId;
  privateKey: string;
  publicKey: string;
  refreshTokensUsed: string[];
  refreshToken: string;
}
