import Product from "../models/Product.js";
import fs from "fs";
import path from "path";
import slugify from "slugify";
import Category from "../models/Category.js";
import mongoose from "mongoose";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .select("-img")
      .populate("category")
      .limit(10)
      .sort({ createdAt: -1 });
    return res.status(200).json({ products, total: products.length });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: error,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .select("-img")
      .populate("category");
    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: error,
    });
  }
};

export const getProductImg = async (req, res) => {
  try {
    const product = await Product.findById(req.params.pId).select("img");
    if (product.img.data) {
      res.set("Content-type", product.img.contentType);
      return res.status(200).send(product.img.data);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: error,
    });
  }
};

export const addProduct = async (req, res) => {
  //   console.log("req");
  //   return;
  try {
    const { name, desc, price, category, qty } = req.fields;
    const { img } = req.files;

    // console.log("fields", req.fields, "files", req.files);
    if (!name || !desc || !price || !category || !qty)
      return res.status(400).json({
        msg: "Name, Description, Price, Category, Quantity are required",
      });
    if (img && img.size > 1000000)
      return res
        .status(400)
        .json({ msg: "Please provide image that is less than 1MB" });
    if (!mongoose.isValidObjectId(category))
      return res.status(400).json({ msg: "Invalid category id" });

    const findCat = await Category.findById(category);
    if (!findCat)
      return res.status(401).json({ msg: "Category doesn't exist" });

    const product = { ...req.fields, slug: slugify(name) };
    if (img) {
      //   console.log("fs", fs.readFileSync(img.path), "img", img);
      //   return;
      product.img = {};
      product.img.data = fs.readFileSync(img.path);
      product.img.contentType = img.type;
    }
    // console.log("product", product);
    // return;

    const newproduct = await Product.create(product);

    return res.status(201).json({
      product: newproduct,
      msg: "Product created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: error,
    });
  }
};

export const updProduct = async (req, res) => {
  try {
    const { name, desc, price, category, qty } = req.fields;
    const { img } = req.files;

    if (!name || !desc || !price || !category || !qty)
      return res.status(400).json({
        msg: "Name, Description, Price, Category, Quantity are required",
      });
    if (img && img.size > 1000000)
      return res
        .status(400)
        .json({ msg: "Please provide image that is less than 1MB" });
    if (!mongoose.isValidObjectId(category))
      return res.status(400).json({ msg: "Invalid category id" });

    const findCat = await Category.findById(category);
    if (!findCat)
      return res.status(401).json({ msg: "Category doesn't exist" });

    const product = await Product.findByIdAndUpdate(
      req.params.pId,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (img) {
      product.img = {};
      product.img.data = fs.readFileSync(img.path);
      product.img.contentType = img.type;
    }

    await product.save();

    return res.status(201).json({
      product,
      msg: "Product updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: error,
    });
  }
};

export const dltProduct = async (req, res) => {
  try {
    const { pId } = req.params;
    if (!mongoose.isValidObjectId(pId))
      return res.status(400).json({ msg: "Invalid product id" });

    const findProduct = await Product.findById(pId);
    if (!findProduct)
      return res.status(401).json({ msg: "Product doesn't exist" });

    await Product.findByIdAndDelete(pId).select("-img");
    return res.status(200).json({
      msg: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: error,
    });
  }
};

// export const productCount = async (req, res) => {
//   try {
//     const total = await Product.find({}).estimatedDocumentCount();
//     return res.status(200).json({
//       total,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       msg,
//     });
//   }
// };

// export const productPage = async (req, res) => {
//   try {
//     const page = req.params.page || 1;
//     const products = await Product.find({})
//       .select("-img")
//       .skip((page - 1) * 10)
//       .limit(10)
//       .sort({ createdAt: -1 });
//     return res.status(200).json(products);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       msg,
//     });
//   }
// };

// export const searchProduct = async (req, res) => {
//   try {
//     const { search } = req.params;
//     const regex = new RegExp(search, "i");
//     const products = await Product.find({
//       name: regex,
//     }).select("-img");
//     return res.status(200).json(products);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       msg,
//     });
//   }
// };

export const getSimilar = async (req, res) => {
  try {
    const { pId, cId } = req.params;
    const products = await Product.find({
      category: cId,
      _id: { $ne: pId },
    })
      .select("-img")
      .limit(3)
      .populate("category");
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: error,
    });
  }
};

export const getByCat = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.cId,
    })
      .select("-img")
      .populate("category");
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: error,
    });
  }
};
