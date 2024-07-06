import bcrypt from "bcrypt";
import crypto from "node:crypto";

import shopModel from "../models/shop.model";
import { ShopRoles } from "../types";
import KeyTokenService from "./keyToken.service";
import { ObjectId } from "mongoose";
import { createTokenPair, verifyJWT } from "../auth/authUtils";
import { LoginRequest, SignUpRequest } from "../types/request";
import { getInfoData } from "../utils";
import {
  AuthError,
  BadRequestError,
  ForbiddenError,
} from "../core/error.response";
import ShopService from "./shop.service";
import { KeyToken } from "../types/keytoken";

class AccessService {
  /*
    1 - Check this refresh token is used?
    2 - If used -> delete it -> notify user login again
    3 - If not used -> compare token sent from request with token save into db -> create new tokens
  */
  static handleRefreshToken = async (refreshToken: string) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );

    // refresh token is used => suspicious (refresh token maybe stolen)
    if (foundToken) {
      // decode to authorize
      const payload = await verifyJWT(refreshToken, foundToken.privateKey);

      // delete all token (delete document of KeyToken collection)
      // @ts-ignore - fix later
      await KeyTokenService.removeByShopId(payload.shopId);
      throw new ForbiddenError(
        "Error: something wrong happend! Please login again"
      );
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new AuthError("Token not found");
    }

    // verify token
    const payload = await verifyJWT(refreshToken, holderToken.privateKey);
    console.log("[2]--", payload);

    // @ts-ignore - fix later
    const foundShop = await ShopService.findByEmail({ email: payload.email });
    if (!foundShop) {
      throw new AuthError("Shop not found");
    }

    // create new tokens
    const tokens = await createTokenPair({
      payload: {
        shopId: foundShop._id as ObjectId,
        email: foundShop.email,
      },
      publicKey: holderToken.publicKey,
      privateKey: holderToken.privateKey,
    });

    // Update token
    await holderToken.updateOne({
      refreshToken: tokens?.refreshToken,
      refreshTokensUsed: [...holderToken.refreshTokensUsed, refreshToken],
    });

    return {
      user: payload,
      tokens,
    };
  };

  static logout = async (keyStore: KeyToken) => {
    if (!keyStore._id) {
      throw new BadRequestError("Error: id of keyStore not found");
    }
    const delKey = await KeyTokenService.removeById(keyStore._id);
    console.log(delKey);
    return delKey;
  };

  /*
    1 - Check email in db
    2 - Match password
    3 - create tokens (access, refresh) and save
    4 - return data
  */
  static login = async ({ email, password }: LoginRequest) => {
    // 1.
    const foundShop = await ShopService.findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Error: Shop not registered");
    }

    // 2.
    const matchPassword = await bcrypt.compare(password, foundShop.password);
    if (!matchPassword) {
      throw new AuthError("Authentication Error");
    }

    // 3.

    // Create 2 secret key
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // Create tokens (access, refresh)
    let shopId = foundShop._id as ObjectId;

    const tokens = await createTokenPair({
      payload: {
        shopId,
        email: foundShop.email,
      },
      publicKey,
      privateKey,
    });

    // save 2 secret key + refresh token
    await KeyTokenService.createKeyToken({
      shopId,
      publicKey,
      privateKey,
      // @ts-ignore - fix later
      refreshToken: tokens?.refreshToken,
    });

    return {
      metadata: {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: foundShop,
        }),
        tokens,
      },
    };
  };

  static signUp = async ({ name, email, password }: SignUpRequest) => {
    // step 1: check if the shop is already registered
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [ShopRoles.SHOP],
    });

    if (newShop) {
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });

      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      console.log(`private key`, privateKey);
      console.log(`public key`, publicKey);

      const keyStore = await KeyTokenService.createKeyToken({
        shopId: newShop._id as ObjectId,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Error: keyStore error");
      }

      const tokens = await createTokenPair({
        payload: {
          shopId: newShop._id as ObjectId,
          email: newShop.email,
        },
        publicKey,
        privateKey,
      });

      console.log(`Created Token Success::`, tokens);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
  };
}

export default AccessService;
