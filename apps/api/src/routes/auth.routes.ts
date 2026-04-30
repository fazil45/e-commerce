import express, { Router } from "express"
import { adminLogin, login, register } from "../controllers/auth.controller.js"

const userRouter:Router = express.Router()

userRouter.post("/register",register)
userRouter.post("/login",login)
userRouter.post("/admin",adminLogin)

export default userRouter