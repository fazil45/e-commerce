import express, { Router } from "express"
import { adminLogin, isAuth, login, logoutAdmin, register, verifyAdmin } from "../controllers/auth.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const userRouter:Router = express.Router()

userRouter.post("/register",register)
userRouter.post("/login",login)
userRouter.post("/admin",adminLogin)
userRouter.get("/verify",verifyAdmin)
userRouter.post("/logout", logoutAdmin);
userRouter.get("/check",authMiddleware,isAuth)

export default userRouter