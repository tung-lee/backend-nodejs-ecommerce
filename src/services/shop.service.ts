import shopModel from "../models/shop.model";

interface FindByEmailRequest {
  email: string;
  select?: { [key: string]: number };
}

class ShopService {
  static findByEmail = async ({
    email,
    select = { email: 1, password: 1, name: 1, status: 1, roles: 1 }
  }: FindByEmailRequest) => {
    return await shopModel.findOne({ email }).select(select).lean();
  };
}

export default ShopService;
