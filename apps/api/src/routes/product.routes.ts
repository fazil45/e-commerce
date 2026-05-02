import express, { Router } from "express";
import {
  addProducts,
  listProducts,
  removeProduct,
  singleProduct,
} from "../controllers/product.controller.js";
import upload from "../middleware/multer.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const productRouter: Router = express.Router();

productRouter.post(
  "/add",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProducts,
);
productRouter.delete("/remove/:productId",removeProduct);
productRouter.get("/single/:productId", singleProduct);
productRouter.get("/list", listProducts);

export default productRouter;
