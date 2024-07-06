import { ObjectId } from "mongoose";

import keyTokenModel from "../models/keytoken.model";
import { CreateKeyTokenRequest } from "../types/request";

class KeyTokenService {
  static createKeyToken = async ({
    shopId,
    publicKey,
    privateKey,
    refreshToken,
  }: CreateKeyTokenRequest): Promise<string | null> => {
    try {
      // lv0
      // const tokens = await keyTokenModel.create({
      //   shopId,
      //   publicKey,
      //   privateKey,
      // });

      // return tokens ? tokens.publicKey : null;

      // level xxx

      const tokens = await keyTokenModel.findOneAndUpdate(
        {
          shopId,
        },
        {
          publicKey,
          privateKey,
          refreshToken,
          refreshTokenUsed: [],
        },
        {
          upsert: true,
          new: true,
        }
      );

      return tokens ? tokens.publicKey : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  static findByShopId = async (shopId: string) => {
    return await keyTokenModel.findOne({ shopId }).lean();
  };

  static removeById = async (id: ObjectId) => {
    return await keyTokenModel.findByIdAndDelete(id);
  };
}

export default KeyTokenService;
