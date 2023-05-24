import mongoose from "mongoose";

const OrderShema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    purchased_date: { type: Date, default: Date.now() },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        cartqty: { type: Number },
        subtotal: { type: Number },
      },
    ],
    total: { type: Number },
    details: {
      name: { type: String },
      email: { type: String },
      address: { type: String },
      phone: { type: String },
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderShema);
