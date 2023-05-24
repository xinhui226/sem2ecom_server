import mongoose from "mongoose";
import Order from "../models/Order.js";
// import { loadStripe } from "@stripe/stripe-js";
// const stripe = await loadStripe(
//   "sk_test_51N5KOHC8zYyDI2PopU5y3D2StEljK4EFIXBAZ8ujaXFwTTv0dqKFSdf0Eg4JpDIqdk0VNVRCUXSGH29GTt8AlUFX00D6eNDDQb"
// );
import stripe from "stripe";

const stripeClient = stripe(
  "sk_test_51N5KOHC8zYyDI2PopU5y3D2StEljK4EFIXBAZ8ujaXFwTTv0dqKFSdf0Eg4JpDIqdk0VNVRCUXSGH29GTt8AlUFX00D6eNDDQb"
);

export const createOrder = async (req, res) => {
  try {
    const { cart, total, details } = req.body;
    const myOrder = await Order.create({
      user: req.user._id,
      items: cart,
      total,
      details,
    });

    let lineItems = [];
    cart.map((item) => {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.pro_name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.cartqty,
      });
    });

    const session = await stripeClient.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/dashboard/user/order",
      cancel_url: "http://localhost:3000/cancel",
    });

    await myOrder.save();
    return res.send(session.url);

    // return res.json({ msg: "ok" });
  } catch (e) {
    return res.status(500).json({
      msg: e,
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "-img")
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({
      msg: e,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "-img")
      .populate("user", "name")
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({
      msg: e,
    });
  }
};

export const updOrder = async (req, res) => {
  try {
    const { oId } = req.params;
    if (!mongoose.isValidObjectId(oId))
      return res.status(400).json({ msg: "Invalid order id" });

    const findOrder = await Order.findById(oId);
    if (!findOrder) return res.status(401).json({ msg: "Order doesn't exist" });

    // return res.json({ oId, status: req.body.status });
    const order = await Order.findByIdAndUpdate(
      oId,
      { status: req.body.status },
      { new: true }
    );
    return res.status(200).json({
      msg: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: error,
    });
  }
};

export const dltOrder = async (req, res) => {
  try {
    const { oId } = req.params;
    if (!mongoose.isValidObjectId(oId))
      return res.status(400).json({ msg: "Invalid order id" });

    const findOrder = await Order.findById(oId);
    if (!findOrder) return res.status(401).json({ msg: "Order doesn't exist" });

    await Order.findByIdAndDelete(oId);
    return res.status(200).json({
      msg: "Order deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: error,
    });
  }
};

export const getOrderByStatus = async (req, res) => {
  try {
    const orders = await Order.find({ status: req.params.status })
      .populate("items.product", "-img")
      .populate("user", "name")
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({
      msg: e,
    });
  }
};
