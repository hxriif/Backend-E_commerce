const jwt = require("jsonwebtoken");
const userdatabase = require("../models/userSchema");
// const products = require("../models/productSchema");
const Products = require("../models/productSchema");
const { ProductJoiSchema } = require("../models/validationSchema");
const mongoose = require("mongoose");

module.exports = {
  // Admin login

  login: async (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.ADMIN_ACCESS_TOKEN_SECRET);
      return res.status(200).json({
        status: "success",
        message: "successfully admin registered",
        data: token,
      });
    } else {
      return res.status(404).json({
        status: "not found",
        message: "Invalid admin",
      });
    }
  },
  allusers: async (req, res) => {
    const allusers = await userdatabase.find();
    if (allusers.length === 0) {
      res.status(404).json({
        status: "error",
        message: "no user found",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "successfully fetched user data",
        data: allusers,
      });
    }
  },

  getUserById: async (req, res) => {
    const userId = req.params.id;
    // console.log(userId)
    const user = await userdatabase.findById(userId);
    console.log(user);
    if (!user) {
      res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "user successfully found",
      data: { user },
    });
  },

  addProduct: async (req, res) => {
    // const { value, error } = ProductJoiSchema.validate(req.body);
    const { value, error } = ProductJoiSchema.validate(req.body);
    // console.log(value)
    if (error) {
      return res.status(404).json({ error: error.details[0].message });
    }
    const { title, description, category, price, image } = value;
    console.log();
    await Products.create({
      title,
      description,
      category,
      price,
      image,
    });
    return res.status(201).json({
      status: "success",
      message: "product added successfully",
      data: Products,
    });
  },
  deleteproduct: async (req, res) => {
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(404).json({
        status: "error",
        message: "Invalid product Id provided",
      });
    }
    const deleteproduct = await Products.findOneAndDelete({ _id: productId });
    if (!deleteproduct) {
      return res.status(404).json({
        status: "error",
        message: "Product Not Found in Database",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "product deleted successfully",
    });
  },
  allproducts: async (req, res) => {
    const productsList = await Products.find();
    if (!productsList) {
      res.status(404).json({
        status: "error",
        message: "Products not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "All product details fetched successfully",
      data: productsList,
    });
  },
};
