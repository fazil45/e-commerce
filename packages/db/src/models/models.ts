import mongoose, { Document, Model, Schema } from "mongoose";

// Interfaces
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string[];
  category: string;
  subCategory: string;
  sizes: string[];        // should be array, not string
  bestseller?: boolean;
  date: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  cartData: Record<string, number>;  // better than plain Object
}

// Schemas typed with interfaces
const productSchema = new Schema<IProduct>({
  name:        { type: String,  required: true },
  description: { type: String,  required: true },
  price:       { type: Number,  required: true },
  image:       { type: [String],required: true },
  category:    { type: String,  required: true },
  subCategory: { type: String,  required: true },
  sizes:       { type: [String],required: true },
  bestseller:  { type: Boolean },
  date:        { type: Number,  required: true },
});

const userSchema = new Schema<IUser>({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
}, { minimize: false });

// Models typed with Model<Interface>
// Guard against re-registration (hot reload fix)
export const productModel: Model<IProduct> =
  mongoose.models.product || mongoose.model<IProduct>("product", productSchema);

export const userModel: Model<IUser> =
  mongoose.models.user || mongoose.model<IUser>("user", userSchema);