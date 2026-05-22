import { userModel } from "@repo/db/models";
import { Request, Response } from "express";

interface CartData {
  [itemId: string]: {
    [size: string]: number;
  };
}

// Add product to cart

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    console.log(userId)

    if (!userId) {
      return res.json({ success: false, error: "Unauthorised" });
    }

    const { itemId, size } = req.body;

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.json({ success: false, error: "User not exists" });
    }

    let cartData = (userData.cartData || {}) as CartData;

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

    await userModel.findByIdAndUpdate(userId, { cartData });

    return res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, error: "Server error" });
  }
};

// Get cart data

export const getCartData = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.json({ success: false, error: "Unauthorised" });
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.json({ success: false, error: "User not exists" });
    }

    let cartData = (userData.cartData || {}) as CartData;

    return res.json({ success: true, cartData: cartData });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, error: "Server error" });
  }
};

// Update cart data

export const updateCart = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.json({ success: false, error: "Unauthorised" });
    }

    const { itemId, size, quantity } = req.body;

    if (!itemId || !size) {
      return res.json({
        success: false,
        error: "Missing fields",
      });
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.json({ success: false, error: "User not exists" });
    }

    let cartData = (userData.cartData || {}) as CartData;

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    if (quantity < 0) {
      return res.json({
        success: false,
        error: "Invalid quantity",
      });
    }

    if (quantity <= 0) {
      delete cartData[itemId][size];

      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });

    return res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, error: "Server error" });
  }
};
