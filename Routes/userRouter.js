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
.get("/view/:id",TryCatchMiddleware(Usercontroller.productById))
.get("/products/:categoryname",TryCatchMiddleware(Usercontroller.productByCategory))
.post("/:id/cart",TryCatchMiddleware(Usercontroller.addToCart))
.get("/:id/cart",TryCatchMiddleware(Usercontroller.viewcart))
.post("/:id/wishlists",TryCatchMiddleware(Usercontroller.AddToWishlist))
.get("/:id/viewWishlist",TryCatchMiddleware(Usercontroller.viewwishlist))
.delete("/:id/removewishlist",TryCatchMiddleware(Usercontroller.deleteWishlist))
.post("/:id/payment",TryCatchMiddleware(Usercontroller.paymet))
.get("/payment/success",TryCatchMiddleware(Usercontroller.success))



module.exports = router;    
                