import bcrypt from "bcrypt";
import crypto from "node:crypto";

import shopModel from "../models/shop.model";
import { ShopRoles } from "../types";
import KeyTokenService from "./keyToken.service";
import { ObjectId } from "mongoose";
import { createTokenPair } from "../auth/authUtils";
import { LoginRequest, SignUpRequest } from "../types/request";
import { getInfoData } from "../utils";
import { AuthError, BadRequestError } from "../core/error.response";
import ShopService from "./shop.service";

class AccessService {
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
