import { ObjectId } from "mongoose";
import { KeyToken } from "./keytoken";

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

export interface HandleRefreshTokenRequest {
  refreshToken: string;
  shop: {
    shopId: ObjectId;
    email: string;
  };
  keyStore: KeyToken;
}
