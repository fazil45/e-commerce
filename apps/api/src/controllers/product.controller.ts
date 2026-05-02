import { productModel } from "@repo/db/models";
import { v2 as cloudinary } from "cloudinary";
import { Request, Response } from "express";

export const addProducts = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    const files = req.files as Record<string, Express.Multer.File[]>;

    const image2 = files.image2?.[0];
    const image3 = files.image3?.[0];
    const image4 = files.image4?.[0];
    const image1 = files.image1?.[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );

    let imageUrl = await Promise.all(
      images.map(async (item) => {
        let results = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return results.secure_url;
      }),
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestSeller: bestSeller === true ? true : false,
      sizes: JSON.parse(sizes),
      image: imageUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    return res.json({
      success: true,
      message: "Product added",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Server error" });
  }
};

export const listProducts = async (req: Request, res: Response) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Server error" });
  }
};

export const removeProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params["productId"]

    if (!productId) {
      return res.json({success:false,error:"product not found"})
    }

    const product = await productModel.findByIdAndDelete(productId)

    return res.json({success:true,error:"Product deleted sucessfully"})

  } catch (error) { 
    console.error(error);
    return res.json({success:false,error:"Server error"})
  }
};

export const singleProduct = async (req: Request, res: Response) => {
   try {
    const productId = req.params["productId"]

    if (!productId) {
      return res.json({success:false,error:"product not found"})
    }

    const product = await productModel.findById(productId)

    return res.json({success:true,product})

  } catch (error) { 
    console.error(error);
    return res.json({success:false,error:"Server error"})
  }
};
