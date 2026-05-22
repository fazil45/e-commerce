import mongoose, { Document, Model, Schema } from "mongoose";

interface CartData {
  [itemId: string]: {
    [size: string]: number;
  };
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string[];
  category: string;
  subCategory: string;
  sizes: string[];
  bestseller?: boolean;
  date: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  cartData: CartData;
}

export interface IOrder extends Document {
  userId: string;
  items: [
    {
      productId: string;
      name: string;
      price: number;
      quantity: number;
      sizes: string[];
      image: string[];
    },
  ];
  amount: number;
  address: Object;
  status: string;
  paymentMethod: string;
  payment: boolean;
  date: number;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: [String], required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: [String], required: true },
  bestseller: { type: Boolean },
  date: { type: Number, required: true },
});

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
  },
  { minimize: false },
);

const orderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  items: {
    type: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        sizes: { type: [String], required: true },
        image: { type: [String], required: true },
      },
    ],
    required: true,
  },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, required: true, default: "Order Placed" },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, required: true, default: false },
  date: { type: Number, required: true },
});

export const productModel: Model<IProduct> =
  mongoose.models.product || mongoose.model<IProduct>("product", productSchema);

export const userModel: Model<IUser> =
  mongoose.models.user || mongoose.model<IUser>("user", userSchema);

export const orderModel: Model<IOrder> =
  mongoose.models.order || mongoose.model<IOrder>("order", orderSchema);
