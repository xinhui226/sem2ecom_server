import express from "express";
import { adminAuth, userAuth } from "../middleware/auth.js";
import {
  createOrder,
  dltOrder,
  getAllOrders,
  getOrder,
  getOrderByStatus,
  updOrder,
} from "../controller/order.js";

const router = express.Router();

router.get("/", userAuth, getOrder);
router.get("/all", adminAuth, getAllOrders);
router.get("/status/:status", userAuth, getOrderByStatus);
router.post("/", userAuth, createOrder);
router.put("/:oId", adminAuth, updOrder);
router.delete("/:oId", adminAuth, dltOrder);

export default router;
