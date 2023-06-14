import express from "express";
import { verifyByJwt } from "./verify-by-jwt";
import Product from "../models/product-model";
const router = express.Router();

router.get("/", verifyByJwt, async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json({ products });
  } catch (error) {
    console.log("Error while getting products", error);
  }
});

export default router;
