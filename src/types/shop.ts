import { Document } from "mongoose";

export interface Shop extends Document {
  name: string;
  email: string;
  password: string;
  status: string;
  verify: boolean;
  roles: string[];
}

export enum ShopStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export const ShopRoles = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
