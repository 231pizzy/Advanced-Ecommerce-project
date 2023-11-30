import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ProductModel } from "../models/productModel";

export const listingRouter = express.Router();

listingRouter.post(
  "/create",
  asyncHandler(async (req: Request, res: Response) => {
    const createdProducts = await ProductModel.create(req.body);

    res.json(createdProducts);
  })
);
