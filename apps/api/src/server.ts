import "dotenv/config"
import express, {Request, Response} from "express"
import { connectDB } from "@repo/db/client"
import cors from "cors"
import { connectCloudinary } from "./config/cloudinary.js"
import userRouter from "./routes/auth.routes.js"
const app = express()
const PORT = process.env.PORT
connectDB()
connectCloudinary()

app.use(express.json())
app.use(cors())


app.use("/api/auth",userRouter)

app.get("/",(req:Request, res:Response) => {
    res.json({
        message:"Hello Fazi"
    })
})


app.listen(PORT, () => console.log(`Server is running on Port:- ${PORT}`),)