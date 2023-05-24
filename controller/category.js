import slugify from "slugify";
import Category from "../models/Category.js";
import mongoose from "mongoose";

export const getCategories = async (req, res) => {
  try {
    const cat = await Category.find({});
    return res.status(200).json(cat);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg,
    });
  }
};

export const getCategory = async (req, res) => {
  try {
    const cat = await Category.findOne({ slug: req.params.slug });
    if (!cat) return res.status(401).json({ msg: "Category doesn't exist" });

    return res.status(200).json(cat);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg,
    });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(401).json({ msg: "Category's name is required" });
    if (name.length <= 2)
      return res
        .status(401)
        .json({ msg: "Minimum 3 characters for category's name" });
    const existCat = await Category.findOne({ name });
    if (existCat)
      return res.status(401).json({ msg: "Category already existed" });

    const cat = await Category.create({ name, slug: slugify(name) });
    return res.status(200).json({
      msg: "Category created successfully",
      cat,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg,
    });
  }
};

export const updCategory = async (req, res) => {
  try {
    const { catId } = req.params;
    const { name } = req.body;

    if (!mongoose.isValidObjectId(catId))
      return res.status(400).json({ msg: "Invalid category id" });

    const findCat = await Category.findById(catId);
    if (!findCat)
      return res.status(401).json({ msg: "Category doesn't exist" });

    if (!name)
      return res.status(401).json({ msg: "Category's name is required" });
    if (name.length <= 2)
      return res
        .status(401)
        .json({ msg: "Minimum 3 characters for category's name" });

    const cat = await Category.findByIdAndUpdate(
      catId,
      {
        name: name,
        slug: slugify(name),
      },
      { new: true }
    );
    return res.status(200).json({
      msg: "Category updated successfully",
      cat,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg,
    });
  }
};

export const dltCategory = async (req, res) => {
  try {
    const { catId } = req.params;
    if (!mongoose.isValidObjectId(catId))
      return res.status(400).json({ msg: "Invalid category id" });

    const findCat = await Category.findById(catId);
    if (!findCat)
      return res.status(401).json({ msg: "Category doesn't exist" });

    await Category.findByIdAndDelete(catId);
    return res.status(200).json({
      msg: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg,
    });
  }
};
