import bcrypt from "bcrypt";
import crypto from "node:crypto";

import shopModel from "../models/shop.model";
import { ShopRoles } from "../types";
import KeyTokenService from "./keyToken.service";
import { ObjectId } from "mongoose";
import { createTokenPair } from "../auth/authUtils";
import { SignUpRequest } from "../types/request";
import { getInfoData } from "../utils";

class AccessService {
  static signUp = async ({ name, email, password }: SignUpRequest) => {
    try {
      // step 1: check if the shop is already registered
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "xxxx",
          message: "Shop already registered",
        };
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
          privateKey
        });

        if (!keyStore) {
          return {
            code: "xxxx",
            message: "keyStore error",
          };
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
    } catch (err) {
      return {
        code: "xxx",
        message: (err as Error).message,
        status: "error",
      };
    }
  };
}

export default AccessService;
