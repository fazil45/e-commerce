import express, { Router } from "express"
import { adminLogin, login, logoutAdmin, register, verifyAdmin } from "../controllers/auth.controller.js"

const userRouter:Router = express.Router()

userRouter.post("/register",register)
userRouter.post("/login",login)
userRouter.post("/admin",adminLogin)
userRouter.get("/verify",verifyAdmin)
userRouter.post("/logout", logoutAdmin);

export default userRouter