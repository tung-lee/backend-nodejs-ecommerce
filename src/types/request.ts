import { ObjectId } from "mongoose";

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateKeyTokenRequest {
  shopId: ObjectId;
  publicKey: string;
}
