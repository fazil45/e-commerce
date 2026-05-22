import express, { Router } from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { addToCart, getCartData, updateCart } from "../controllers/cart.controller.js"
const cartRouter:Router = express.Router()
const app = express()

app.use(authMiddleware)

cartRouter.post('/add',authMiddleware, addToCart)
cartRouter.get('/get',authMiddleware, getCartData)
cartRouter.post('/update',authMiddleware,updateCart)

export default cartRouter