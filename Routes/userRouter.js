const express=require('express');
const TryCatchMiddleware = require('../middlewares/Trycatchmiddleware');
const Usercontroller = require('../controllers/Usercontroller');
const router=express.Router();



router
.post("/register",TryCatchMiddleware(Usercontroller.userRegister)) 
.post("/login",TryCatchMiddleware(Usercontroller.userlogin))




module.exports=router