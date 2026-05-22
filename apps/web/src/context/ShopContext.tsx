import React, { createContext, useEffect, useState, type ReactNode } from "react";
import { type ProductType } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import axios from "axios";

export type CartItemsType = {
  [itemId: string]: {
    [size: string]: number;
  };
};

export type ShopContextType = {
  products: ProductType[];
  currency: string;
  backendUrl: string;
  delivery_fee: number;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showSearch: boolean;
  currentState: "Signup" | "Login";
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentState: React.Dispatch<React.SetStateAction<"Signup" | "Login">>;
  setCartItems:React.Dispatch<React.SetStateAction<CartItemsType>>
  cartItems: CartItemsType;
  addToCart: (itemId: string, size: string) => void;
  updateQuantity: (itemId: string, size: string, quantity: number) => void;
  getCartCount: () => number;
  getCartAmount: () => number;
  navigate: NavigateFunction;
  isAuthenticated: boolean;
};

export const ShopContext = createContext<ShopContextType>({
  products: [],
  currency: "$",
  backendUrl: "",
  delivery_fee: 0,
  search: "",
  setSearch: () => {},
  showSearch: false,
  currentState: "Signup",
  setCurrentState: () => {},
  setShowSearch: () => {},
  cartItems: {},
  addToCart: () => {},
  updateQuantity: () => {},
  getCartCount: () => 0,
  setCartItems:() => {},
  getCartAmount: () => 0,
  navigate: () => {},
  setIsAuthenticated: () => {},
  isAuthenticated: false,
});

const ShopContextProvider = ({ children }: { children: ReactNode }) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_HTTP_URL;
  const [search, setSearch] = useState("");
  const [currentState, setCurrentState] = useState<"Signup" | "Login">(
    "Signup",
  );
  const [showSearch, setShowSearch] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);
  const navigate: NavigateFunction = useNavigate();
  const [cartItems, setCartItems] = useState<CartItemsType>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${backendUrl}/auth/check`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const addToCart = async (itemId: string, size: string) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);

    if (isAuthenticated) {
      try {
        const response = await axios.post(
          `${backendUrl}/cart/add`,
          {
            itemId,
            size,
          },
          {
            withCredentials: true,
          },
        );

        if (response.data.success) {
          toast.success("Product added");
        } else {
          toast.error(response.data.error);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error.response?.data.error);
        } else {
          toast.error("Something went wrong");
        }
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size]) {
          totalCount += cartItems[itemId][size];
        }
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      let itemInfo = products.find((product) => product._id === itemId);
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          totalAmount += itemInfo?.price! * cartItems[itemId][size];
        }
      }
    }
    return totalAmount;
  };

  const updateQuantity = async (
    itemId: string,
    size: string,
    quantity: number,
  ) => {
    const previousCart = structuredClone(cartItems);

    setCartItems((prev) => {
      const cartData = structuredClone(prev);

      if (!cartData[itemId]) return prev;

      if (quantity <= 0) {
        delete cartData[itemId][size];

        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      } else {
        cartData[itemId][size] = quantity;
      }

      return cartData;
    });

    try {
      if (isAuthenticated) {
        await axios.post(
          `${backendUrl}/cart/update`,
          { itemId, size, quantity },
          {
            withCredentials: true,
          },
        );
      }
    } catch (error) {
      setCartItems(previousCart);

      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
      }
    }
  };

  const getProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/product/list`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data.error);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const getUserCart = async () => {
    try {
      const response = await axios.get(`${backendUrl}/cart/get`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setCartItems(response.data.cartData);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data.error);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getUserCart()
    }
  },[isAuthenticated])

  useEffect(() => {
    getProducts();
  }, []);

  

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
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    currentState,
    setCurrentState,
    setIsAuthenticated,
    isAuthenticated,
    setCartItems     
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
