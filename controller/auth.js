import User from "../models/User.js";
import { comparepassword, hashedpassword } from "../utils/auth.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res
        .status(400)
        .json({ msg: "Please provide all the required fields" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res
        .status(409)
        .json({ success: false, msg: "User already exist" });
    }

    const hashedPassword = await hashedpassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    return res
      .status(200)
      .json({ success: true, msg: "Successfully registered", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Failed to register",
      msg,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(404).json({
        success: false,
        msg: "Please provide email and password",
      });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
      });

    const matchPassword = await comparepassword(password, user.password);
    if (!matchPassword)
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
      });

    const token = JWT.sign({ user: user }, process.env.SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      msg: "Successfully logged in",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Failed to login",
      msg,
    });
  }
};

export const updProfile = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    let hashedPassword;
    if (newPassword && password) {
      const checkPassword = await bcrypt.compare(password, user.password);

      if (checkPassword) {
        hashedPassword = await bcrypt.hash(newPassword, 10);
      } else {
        return res.status(401).json({ msg: "Incorrect password" });
      }
      delete req.body.newPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        ...req.body,
        password: newPassword ? hashedPassword : user.password,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ msg: "Updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg,
    });
  }
};
