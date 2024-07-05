import JWT from "jsonwebtoken";
import { ObjectId } from "mongoose";

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

export { createTokenPair };
