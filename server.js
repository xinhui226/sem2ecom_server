import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import auth from "./routes/auth.js";
import category from "./routes/category.js";
import product from "./routes/product.js";
import order from "./routes/order.js";
import { sendMail } from "./utils/sendMail.js";
dotenv.config();

const app = express();
const port = process.env.PORT;
mongoose.connect(process.env.DB_URL);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", auth);
app.use("/category", category);
app.use("/products", product);
app.use("/orders", order);
app.post("/sendMail", async (req, res) => {
  try {
    const { email, subject, content: value } = req.body;
    const send = await sendMail(email, subject, value);
    if (send === 202) return res.status(200).json({ msg: "Message sent" });
    return res.status(500).json({ msg: "Error sending email" });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
});

app.get("/test", (req, res) => res.send("wanna die"));

app.listen(port, () => console.log("Server running on port :" + port));
mongoose.connection.once("open", () => console.log("Connected to mongodb..."));
