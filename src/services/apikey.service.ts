// import crypto from "crypto";

import apikeyModel from "../models/apikey.model";
// import { Permission } from "../types/apikey";

class ApiKeyService {
  static findById = async (key: string) => {
    // Test only
    // const newApiKey = await apikeyModel.create({
    //   key: crypto.randomBytes(64).toString("hex"),
    //   status: true,
    //   permissions: [Permission.A],
    // });
    // console.log(newApiKey);
    // End test only

    const apiKeyObj = await apikeyModel.findOne({ key, status: true }).lean();
    return apiKeyObj;
  };
}

export default ApiKeyService;
