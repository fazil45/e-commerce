import "dotenv/config"
import express, {Request, Response} from "express"
import { connectDB } from "@repo/db/client"
import cors from "cors"
import { connectCloudinary } from "./config/cloudinary.js"
import userRouter from "./routes/auth.routes.js"
import CookieParser from "cookie-parser"
import productRouter from "./routes/product.routes.js"
import cookieParser from "cookie-parser"
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


app.use("/api/auth",userRouter)
app.use("/api/product",productRouter)

app.get("/",(req:Request, res:Response) => {
    res.json({
        message:"Hello Fazi"
    })
})


app.listen(PORT, () => console.log(`Server is running on Port:- ${PORT}`),)