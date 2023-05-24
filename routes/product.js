import express from "express";
import formidable from "express-formidable";
import { adminAuth } from "../middleware/auth.js";
import {
  addProduct,
  dltProduct,
  getByCat,
  getProduct,
  getProductImg,
  getProducts,
  getSimilar,
  // productCount,
  // productPage,
  // searchProduct,
  updProduct,
} from "../controller/product.js";
const router = express.Router();

router.get("/", getProducts);
router.get("/:slug", getProduct);
router.get("/img/:pId", getProductImg);
router.get("/similar/:pId/:cId", getSimilar);
router.get("/getbycat/:cId", getByCat);
router.post("/", adminAuth, formidable(), addProduct);
router.put("/:pId", adminAuth, formidable(), updProduct);
router.delete("/:pId", adminAuth, dltProduct);

export default router;
