import "dotenv/config"
import express from "express"
import { connectDB } from "@repo/db/client"
import cors from "cors"
import { connectCloudinary } from "./config/cloudinary.js"
import userRouter from "./routes/auth.routes.js"
import productRouter from "./routes/product.routes.js"
import cookieParser from "cookie-parser"
import cartRouter from "./routes/cart.route.js"
import orderRouter from "./routes/order.route.js"
const app = express()
const PORT = process.env.PORT
connectDB()
connectCloudinary()

app.use(cookieParser())
app.use(express.json())

app.use(cors({
    origin:["http://localhost:5173","http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}))

// User
app.use("/api/auth",userRouter)

// Product
app.use("/api/product",productRouter)

// Cart 
app.use("/api/cart",cartRouter)

// Order
app.use("/api/order",orderRouter)

app.listen(PORT, () => console.log(`Server is running on Port:- ${PORT}`),)