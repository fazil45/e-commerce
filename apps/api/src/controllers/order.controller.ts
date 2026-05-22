import { orderModel, userModel } from "@repo/db/models";
import { Request, Response } from "express";
import Razorpay from "razorpay";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const currency = "inr";
const deliveryCharge = 10;

// Cash on Delivery
export const placeOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorised" });
    }

    const { items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    return res.status(200).json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Stripe
export const placeOrderStripe = async (req: Request, res: Response) => {
  try {
    //Gateway initialize

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorised" });
    }

    const { items, amount, address } = req.body;

    if (!items || !amount || !address) {
      return res.status(404).json({ success: false, error: "Invalid inputs" });
    }

    const origin = req.headers.origin;

    // Calculate amount from backend
    const calculatedAmount =
      items.reduce(
        (total: number, item: any) => total + item.price * item.quantity,
        0,
      ) + deliveryCharge;

    if (calculatedAmount !== amount) {
      return res.status(400).json({
        success: false,
        error: "Amount mismatch",
      });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const orderIdStr = String(newOrder._id);

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${orderIdStr}`,
      cancel_url: `${origin}/verify?success=false&orderId=${orderIdStr}`,
      line_items,
      mode: "payment",
      metadata: {
        orderId: orderIdStr,
        userId,
      },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

//Verify stripe

export const verifyStripe = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { success, orderId } = req.body;

    if (!success || !orderId) {
      return res.status(403).json({ success: false, error: "Invalid inputs" });
    }

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: "Something went wrong" });
  }
};

// Razorpay
export const placeOrderRazorpay = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorised" });
    }

    const { items, amount, address } = req.body;

    if (!items || !amount || !address) {
      return res.status(404).json({ success: false, error: "Invalid inputs" });
    }

    // Calculate amount from backend
    const calculatedAmount =
      items.reduce(
        (total: number, item: any) => total + item.price * item.quantity,
        0,
      ) + deliveryCharge;

    if (calculatedAmount !== amount) {
      return res.status(400).json({
        success: false,
        error: "Amount mismatch",
      });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: String(newOrder._id),
    };

    await razorpay.orders.create(options, (error, order) => {
      if (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: error });
      }
      res.json({ success: true, order });
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: "Something went wrong" });
  }
};

// Verify Razorpay
export const verifyRazorPay = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const {razorpay_order_id} = req.body

    if (!razorpay_order_id) {
      return res.status(402).json({success:false,error:"Invalid input"})
    }

    const orderInfo = await razorpay.orders.fetch(razorpay_order_id)

    if (orderInfo.status === 'paid') {
      await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
      await userModel.findByIdAndUpdate(userId,{cartData:{}})
      return res.status(200).json({success:true,message:"Payment Successful"})
    } else {
      return res.status(400).json({success:false,error:"Payment Failed"})
    }

  } catch (error) {
    console.error(error);
    res.json({ success: false, error: "Something went wrong" });
  }
};

// For Admin
export const allOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderModel.find({});

    if (!orders) {
      return res.status(404).json({
        success: false,
        error: "Orders not found",
      });
    }

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// User Order data
export const userOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const orders = await orderModel.find({ userId });

    if (!orders) {
      return res.status(404).json({
        success: false,
        error: "Orders not found",
      });
    }

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Order Status
export const orderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(403).json({ success: false, error: "Invalid request" });
    }

    await orderModel.findByIdAndUpdate(orderId, { status });

    return res.status(200).json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ success: false, error: "Server error" });
  }
};
