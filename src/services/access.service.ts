import bcrypt from "bcrypt";
import crypto from "node:crypto";

import shopModel from "../models/shop.model";
import { ShopRoles } from "../types";

interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

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
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 2048,
        });
        console.log(privateKey, publicKey);
      }

      return {
        code: "xxxx",
        message: "Shop registered successfully",
        status: "success",
      };
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
