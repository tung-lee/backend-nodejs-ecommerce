import { ObjectId } from "mongoose";

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateKeyTokenRequest {
  shopId: ObjectId;
  publicKey: string;
  privateKey: string;
  refreshToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  refreshToken?: string;
}
