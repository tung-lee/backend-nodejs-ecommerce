import { ObjectId } from "mongoose";

export interface Product {
  name: string;
  thumbnail: string;
  description: string;
  price: number;
  quantity: number;
  type: ProductType;
  shopId: ObjectId;
  attributes: any; // fix later
}

export enum ProductType {
  ELECTRONICS = "electronics",
  CLOTHING = "clothing",
  FURNITURE = "furniture",
}

export interface Clothing {
  brand: string;
  size: string;
  material: string;
}

export interface Electronics {
  manufacturer: string;
  model: string;
  color: string;
}
