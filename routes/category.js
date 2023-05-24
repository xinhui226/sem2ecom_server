import express from "express";
import { adminAuth } from "../middleware/auth.js";
import {
  addCategory,
  dltCategory,
  getCategories,
  getCategory,
  updCategory,
} from "../controller/category.js";
const router = express.Router();

router.get("/", getCategories);
router.get("/:slug", getCategory);
router.post("/", adminAuth, addCategory);
router.put("/:catId", adminAuth, updCategory);
router.delete("/:catId", adminAuth, dltCategory);

export default router;
