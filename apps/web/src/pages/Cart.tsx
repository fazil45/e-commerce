import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";

type CartItemType = {
  _id: string;
  size: string;
  quantity: number;
};

const Cart = () => {
  const { products, currency, updateQuantity, cartItems } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState<CartItemType[]>([]);

  useEffect(() => {
    const tempData: CartItemType[] = [];

    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          tempData.push({
            _id: itemId,
            size,
            quantity: cartItems[itemId][size],
          });
        }
      }
    }

    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1="YOUR" text2="CART" />
      </div>

      {/* ✅ Empty cart check */}
      {cartData.length === 0 ? (
        <div className="text-center text-xl py-10">Your cart is empty</div>
      ) : (
        <div>
          {cartData.map((item) => {
            const productData = products.find(
              (product) => product._id === item._id
            );

            if (!productData) return null;

            return (
              <div
                key={item._id + item.size}
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
              >
                {/* Product Info */}
                <div className="flex items-start gap-6">
                  <img
                    src={productData.image[0]}
                    className="w-16 sm:w-20"
                    alt=""
                  />
                  <div>
                    <p className="text-sm sm:text-lg font-medium">
                      {productData.name}
                    </p>

                    <div className="flex items-center gap-5 mt-2">
                      <p>
                        {currency}
                        {productData.price}
                      </p>

                      <p className="px-2 sm:px-3 sm:py-1 border rounded-md bg-slate-50">
                        {item.size}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(
                      item._id,
                      item.size,
                      Number(e.target.value)
                    )
                  }
                  className="border text-gray-600 outline-none max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                />

                {/* Delete */}
                <img
                  onClick={() =>
                    updateQuantity(item._id, item.size, 0)
                  }
                  src={assets.bin_icon}
                  className="w-4 mr-4 sm:w-5 cursor-pointer"
                  alt=""
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cart;