import express, { Router } from "express"
import { adminMiddleware } from "../middleware/admin.middleware.js"
import { allOrders, orderStatus, placeOrder, placeOrderRazorpay, placeOrderStripe, userOrders, verifyRazorPay, verifyStripe } from "../controllers/order.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const orderRouter:Router = express.Router() 

// Admin Routes
orderRouter.get('/list',adminMiddleware,allOrders)
orderRouter.post('/status',adminMiddleware,orderStatus)

// User Routes
orderRouter.post('/place/cod',authMiddleware,placeOrder)
orderRouter.post('/place/stripe',authMiddleware,placeOrderStripe)
orderRouter.post('/place/razorpay',authMiddleware,placeOrderRazorpay)

// User Features
orderRouter.get('/userorders',authMiddleware,userOrders)

// Verify
orderRouter.post("/verifyStripe",authMiddleware,verifyStripe)
orderRouter.post("/verifyRazorPay",authMiddleware,verifyRazorPay)

export default orderRouter