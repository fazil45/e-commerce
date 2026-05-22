import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { Request, Response } from "express";
import { userModel } from "@repo/db/models";

const isProduction = process.env.NODE_ENV === "production";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (!password || password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // checking user already exists or not
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await (userModel as any).create({
      name,
      email,
      password: hashedPassword,
    });
    return res.json({
      success: true,
      message: "Signedup Successfully",
      user: newUser,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const checkUserExists = await userModel.findOne({ email });

    const matchPassword = await bcrypt.compare(
      password,
      checkUserExists?.password!,
    );

    if (!matchPassword) {
      return res.json({ success: false, message: "Incorrect credentials" });
    }

    const token = jwt.sign(
      {
        _id: checkUserExists?._id,
      },
      process.env.JWT_SECRET!,
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 45 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Signin successfully",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const adminToken = jwt.sign({ email, password }, process.env.JWT_SECRET!);
      return res
        .cookie("adminToken", adminToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          maxAge: 45 * 60 * 1000,
        })
        .json({ success: true });
    } else {
      return res.json({ success: false, message: "Invalid credential" });
    }
  } catch (error) {
    console.error(error);
    return res.json({ success: false, error: "Server Error" });
  }
};

export const verifyAdmin = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return res.json({
        success: false,
      });
    }

    jwt.verify(token, process.env.JWT_SECRET!);

    return res.json({
      success: true,
    });
  } catch (error) {
    return res.json({
      success: false,
    });
  }
};

export const isAuth = async (req:Request, res:Response) => {
  res.json({
    success:true
  })
}


export const logoutAdmin = async (req: Request, res: Response) => {
  return res
    .clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
};