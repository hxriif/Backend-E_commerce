const jwt = require("jsonwebtoken");
const userdatabase = require("../models/userSchema");

module.exports = {
  // Admin login

  login: async (req, res) => {
    const { email, password } = req.body;
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
};
