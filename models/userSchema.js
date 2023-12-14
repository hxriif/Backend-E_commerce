const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  password: String,
  cart: [
    {
      productsId: { type: mongoose.Schema.ObjectId, ref: "products" },
    },
  ],
});

userschema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  next();
});
module.exports = mongoose.model("user", userschema);
