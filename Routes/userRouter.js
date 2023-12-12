const express = require("express");
const TryCatchMiddleware = require("../middlewares/Trycatchmiddleware");
const Usercontroller = require("../controllers/Usercontroller");
const router = express.Router();
const userVerifyToken=require('../middlewares/userAuthMiddleware')

router
  .post("/register", TryCatchMiddleware(Usercontroller.userRegister))
  .post("/login", TryCatchMiddleware(Usercontroller.userlogin))

.use(userVerifyToken)

.get("/products",TryCatchMiddleware(Usercontroller.userViewProduct))

module.exports = router;
