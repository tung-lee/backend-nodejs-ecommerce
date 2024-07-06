import JWT from "jsonwebtoken";
import { ObjectId } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { Header } from "../types/header";
import { AuthError, NotFoundError } from "../core/error.response";
import KeyTokenService from "../services/keyToken.service";

interface CreateTokenPairRequest {
  payload: {
    shopId: ObjectId;
    email: string;
  };
  publicKey: string;
  privateKey: string;
}

const createTokenPair = async ({
  payload,
  publicKey,
  privateKey,
}: CreateTokenPairRequest) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    let decode = JWT.verify(accessToken, publicKey);
    console.log(`decode verify::`, decode);

    return { accessToken, refreshToken };
  } catch (err) {
    console.log(err);
  }
};

const authentication = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  /*
  1 - Check shopId header
  2 - Get keystore with shopId
  3 - Get access token header
  4 - Verify token
  5 - Check shopId
  6 - Ok all => return next()
   */

  // 1.
  const shopId = req.headers[Header.SHOP_ID]?.toString();
  if (!shopId) throw new AuthError("Invalid request");

  // 2.
  const keyStore = await KeyTokenService.findByShopId(shopId);
  if (!keyStore) throw new NotFoundError("Not found keystore");

  // 3.
  const accessToken = req.headers.authorization?.toString();
  if (!accessToken) throw new AuthError("Invalid request");

  // 4.
  try {
    const payload = JWT.verify(accessToken, keyStore.publicKey);

    // 5.
    // @ts-ignore - fix later
    if (shopId !== payload.shopId) {
      throw new AuthError("Invalid ShopId");
    }

    // @ts-ignore - fix later
    req.keyStore = keyStore;
    return next();
  } catch (err) {}
};

export { createTokenPair, authentication };
