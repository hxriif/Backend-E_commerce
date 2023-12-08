const jwt = require("jsonwebtoken");
const userschema = require("../models/userSchema");
const bcrypt = require("bcrypt");
const { userjoiSchema } = require("../models/validationSchema");

module.exports = {
  userRegister: async (req, res) => {
    const { value, error } = userjoiSchema.validate(req.body);
    // console.log(value)
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

      res.status(200).json({
        status: "success",
        message: "Login Successful",
        data: { id, email, Token },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },
};
