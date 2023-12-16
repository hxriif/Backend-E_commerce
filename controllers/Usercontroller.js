const jwt = require("jsonwebtoken");
const userschema = require("../models/userSchema");
const bcrypt = require("bcrypt");
const { userjoiSchema } = require("../models/validationSchema");
const Products = require("../models/productSchema");
const { ObjectId } = require("mongoose").Types;
const cookie = require("cookie");

module.exports = {
  userRegister: async (req, res) => {
    const { value, error } = userjoiSchema.validate(req.body);
    if (error) {
      return (
        res.status(400),
        json({
          status: "Error",
          message: "invalid user input data,please enter a valid data",
        })
      );
    }
    try {
      const { name, email, username, password } = value;
      await userschema.create({
        name,
        email,
        password,
        username,
      });
      res.status(201).json({
        status: "success",
        message: "user registered successfully",
      });
    } catch {
      res.status(500).json({
        status: "Error",
        message: "internal server error",
      });
    }
  },

  userlogin: async (req, res) => {
    const { value, error } = userjoiSchema.validate(req.body);
    if (error) {
      return res.json(error.message);
    }

    const { email, password } = value;

    try {
      const user = await userschema.findOne({
        email: email,
      });

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "user not found",
        });
      }

      const id = user.id;

      if (!password || !user.password) {
        return res.status(400).json({
          status: "error",
          message: "invalid input",
        });
      }

      const passwordmatch = await bcrypt.compare(password, user.password);
      if (!passwordmatch) {
        return res.status(401).json({
          status: "error",
          message: "incorrect password",
        });
      }

      const Token = jwt.sign(
        { email: user.email },
        process.env.USER_ACCES_TOKEN_SECRET,
        {
          expiresIn: 8500,
        }
      );
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", Token, {
          httpOnly: true,
          maxAge: 8500,
          path: "/",
        })
      );

      res.status(200).json({
        status: "success",
        message: "Login Successful",
        data: { id, email, Token },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },
  userViewProduct: async (req, res) => {
    const products = await Products.find();
    if (!products) {
      return res.status(404).json({
        status: "error",
        message: "not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "product fetched successfully",
      data: products,
    });
  },

  productById: async (req, res) => {
    const productId = req.params.id;
    const product = await Products.findById(productId);
    if (!product) {
      res.status(404).json({
        status: "error",
        message: "product not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "product fetched successfully✅",
      data: product,
    });
  },
  productByCategory: async (req, res) => {
    const productcategory = req.params.categoryname;
    const product = await Products.find({ category: productcategory });
    if (!product) {
      res.status(404).json({
        status: "error",
        message: "category not found ",
      });
    }
    res.status(200).json({
      status: "success",
      message: "product category fetched✅",
      data: { product },
    });
  },
  addToCart: async (req, res) => {
    const userId = req.params.id;
    const user = await userschema.findById(userId);

    if (!user) {
      res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }
    const { producId } = req.body;

    if (!producId) {
      res.status(404).json({
        status: "error",
        message: "product not found",
      });
    }
    const productObject = {
      productsId: new ObjectId(producId),
    };
    try {
      await userschema.updateOne(
        { _id: user._id },
        { $push: { cart: productObject } }
      );
      res.status(200).json({
        status: "success",
        message: "successfully product added to cart",
      });
    } catch {
      res.status(500).json({
        status: "error",
        message: "internal server error",
      });
    }
  },
  viewcart: async (req, res) => {
    const UserId = req.params.id;
    const user = await userschema.findById(UserId);
    if (!user) {
      res.status(404).json({
        status: "error",
        message: "user not found ",
      });
    }
    const userProductId = user.cart;
    if (userProductId.length === 0) {
      res.status(200).json({
        stauts: "success",
        message: "user cart is empty",
        data: [],
      });
    }
    const cartproducts = await userschema
      .findOne({ _id: UserId })
      .populate("cart.productsId");
    res.status(200).json({
      status: "success",
      message: "cart product fetched successfully",
      data: cartproducts,
    });
  },
  AddToWishlist: async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
      res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }
    const { productId } = req.body;
    const products = await Products.findById(productId);
    if (!products) {
      res.status(404).json({
        status: "error",
        message: "product not found", 
      });
    }
    const productsFind = await userschema.findOne({
      _id: userId,  
      wishlist: productId,
    });
    if (productsFind) {
     return res.status(200).json({
        status: "success",
        message: "product already in wishlist",
      });
    }
    await userschema.updateOne(
      { _id: userId },
      { $push: { wishlist: productId } }
    );
    res.status(200).json({
      status: "success",   
      messsage: "successfully product added to wishlist",
    });
  },
  viewwishlist: async (req, res) => {
    const userId = req.params.id;
    const user = await userschema.findById(userId);
    if (!user) {
      res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }
    const wishlistproductId = user.wishlist;
    if (wishlistproductId.length === 0) {
      res.status(404).json({
        status: "success",
        message: "empty wishlist",
        data: [],
      });    
    }
    const wishlistproduct = await Products.find({
      _id: { $in: wishlistproductId },
    });
    res.status(200).json({
      status: "success",
      message: "wishlist product fetched successfully",
      data: wishlistproduct,
    });
  },
  deleteWishlist:async (req,res)=>{
    const userId=req.params.id
    const user=await userschema.findById(userId)
    if(!user){
      res.status(404).json({
        status:"error",
        message:"user not found"
      })
    }
    const {productId}=req.body;
    if(!productId){
      res.status(404).json({
        status:"error",
        message:"product not found"
      })
    }
    await userschema.updateOne({_id:userId},{$pull:{wishlist:productId}})
    res.status(200).json({
      status:"success",
      message:"product succesfully removed from wishlist "
    })
  },
};
