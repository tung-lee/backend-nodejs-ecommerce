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
    return await keyTokenModel.findOne({ shopId });
  };

  static removeById = async (id: ObjectId) => {
    return await keyTokenModel.findByIdAndDelete(id);
  };

  static findByRefreshTokenUsed = async (refreshToken: string) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: { $in: [refreshToken] } }) // refreshToken is in the array refreshTokensUsed
      .lean();
  };

  static removeByShopId = async (shopId: ObjectId) => {
    return await keyTokenModel.findOneAndDelete({ shopId });
  };

  static findByRefreshToken = async (refreshToken: string) => {
    return await keyTokenModel.findOne({ refreshToken });
  };
}

export default KeyTokenService;
