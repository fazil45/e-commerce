import jwt, { JwtPayload } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express";

export const adminMiddleware = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const adminToken = req.cookies.adminToken

        if (!adminToken) {
            return res.json({
                success:false,
                error:"Invalid or expired token "
            })
        }

        const decoded = jwt.verify(adminToken,process.env.JWT_SECRET!) as JwtPayload

        if (!decoded) {
            return res.json({success:false,error:"Invalid or expired token"})
        } 

        if (decoded.email === process.env.ADMIN_EMAIL && decoded.password === process.env.ADMIN_PASSWORD) {
            return res.json({success:false,error:"Not authorised Login Again"})
        }
        next()

    } catch (error) {
        console.error(error);
        return res.json({success:false,error:"Server error"})
    }
}