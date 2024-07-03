import keyTokenModel from "../models/keytoken.model";
import { CreateKeyTokenRequest } from "../types/request";

class KeyTokenService {
  static createKeyToken = async ({
    shopId,
    publicKey,
  }: CreateKeyTokenRequest): Promise<string | null> => {
    try {
      const tokens = await keyTokenModel.create({
        shopId,
        publicKey,
      });

      return tokens ? tokens.publicKey : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };
}

export default KeyTokenService;
