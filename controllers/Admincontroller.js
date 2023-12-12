const jwt = require("jsonwebtoken");
const userdatabase = require("../models/userSchema");
const products = require("../models/productSchema");
const { ProductJoiSchema } = require("../models/validationSchema");

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
    const { value, error } = ProductJoiSchema.validate(req.body);
    if (error) {
      res.status(404).json({ error: error.details[0].message });
    }
    const { title, description, category, price, image } = value;
    const newproducts = await products.create({
      title,
      description,
      category,
      price,
      image,
    });
    res.status(200).json({
      status: "success",
      message: "product added successfully",
      data: newproducts,
    });
  },
};
