import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ProductModel } from "../models/productModel";

export const productRouter = express.Router();
// /api/prodcuts
productRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await ProductModel.find();
    res.json(products);
  })
);

productRouter.get(
  "/categories",
  asyncHandler(async (req: Request, res: Response) => {
    const categories = await ProductModel.find().distinct("category");
    res.json(categories);
  })
);

// /api/slug/tshirt
productRouter.get(
  "/slug/:slug",
  asyncHandler(async (req, res) => {
    const product = await ProductModel.findOne({ slug: req.params.slug });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  })
);

productRouter.get(
  "/search/:category",
  asyncHandler(async (req: Request, res: Response) => {
    const searchData = await ProductModel.find({
      category: req.params.category,
    });
    if (searchData) {
      res.json(searchData);
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  })
);

productRouter.post(
  "/update/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductModel.findById(req.params.id);
    if (product) {
      await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json({ message: "Product updated Successfully" }); // Success response
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  })
);

productRouter.delete(
  "/delete/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductModel.findById(req.params.id);
    if (product) {
      await ProductModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Product Deleted Successfully" }); // Success response
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  })
);

// /api/products/:id
productRouter.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.id;

    try {
      const product = await ProductModel.findById(productId);

      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: "Product Not Found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

productRouter.get(
  "/category/:category",
  asyncHandler(async (req, res) => {
    const category = req.params.category;

    try {
      const products = await ProductModel.find({ category });

      if (products && products.length > 0) {
        res.json(products);
      } else {
        res.status(404).json({ message: "No Products Found in this Category" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);
