import { createContext, useEffect, useState, type ReactNode } from "react";
import { products, type ProductType } from "../assets/assets";
import { toast } from "react-toastify";

export type CartItemsType = {
  [itemId: string]: {
    [size: string]: number;
  };
};

export type ShopContextType = {
  products: ProductType[];
  currency: string;
  delivery_fee: number;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: CartItemsType;
  addToCart: (itemId: string, size: string) => void;
  updateQuantity: (itemId: string, size: string, quantity: number) => void;
  getCartCount: () => number;
};

export const ShopContext = createContext<ShopContextType>({
  products: [],
  currency: "$",
  delivery_fee: 0,
  search: "",
  setSearch: () => {},
  showSearch: false,
  setShowSearch: () => {},
  cartItems: {},
  addToCart: () => {},
  updateQuantity: () => {},
  getCartCount: () => 0
});

const ShopContextProvider = ({ children }: { children: ReactNode }) => {
  const currency = "$";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [cartItems,setCartItems] = useState<CartItemsType>({})

  const addToCart = async (itemId:string, size:string ) => {

    if(!size){
      toast.error("Select Product Size")
      return
    }

    let cartData =  structuredClone(cartItems)

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1
      } else {
        cartData[itemId][size] = 1
      }
    } else {
      cartData[itemId] = {}
      cartData[itemId][size] =1
    }
    setCartItems(cartData)
  }

  const getCartCount =  () => {
      let totalCount = 0
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]){
            if (cartItems[itemId][size]) {
               totalCount += cartItems[itemId][size]
            }
        }
      }
      return totalCount
  }

 const updateQuantity = (itemId: string, size: string, quantity: number) => {
  setCartItems(prev => {
    const cartData = structuredClone(prev);

    // safety check
    if (!cartData[itemId]) return prev;

    if (quantity <= 0) {
      delete cartData[itemId][size];

      // remove product if no sizes left
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    return cartData;
  });
};

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    showSearch,
    setSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
