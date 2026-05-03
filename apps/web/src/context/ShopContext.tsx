import { createContext, type ReactNode } from "react";
import { products, type ProductType } from "../assets/assets";

export type ShopContextType = {
  products: ProductType[] ;
  currency: string;
  delivery_fee: number;
};

export const ShopContext = createContext<ShopContextType>({
  products: [],
  currency: "$",
  delivery_fee: 0,
});

const ShopContextProvider = ({ children }: { children: ReactNode }) => {
  const currency = "$";
  const delivery_fee = 10;

  const value = {
    products,
    currency,
    delivery_fee,
  };

  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
