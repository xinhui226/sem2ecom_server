import express from "express";
import { register, login, updProfile } from "../controller/auth.js";
import { userAuth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update", userAuth, updProfile);

router.get("/user", userAuth, (req, res) => {
  res.status(200).json({ pass: true });
});
router.get("/admin", adminAuth, (req, res) => {
  res.status(200).json({ pass: true });
});
router.get("/test", adminAuth, (req, res) => {
  res.send("whatever");
});

export default router;
