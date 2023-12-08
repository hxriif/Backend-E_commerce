const express = require("express");
const router = express.Router();
const admincontroller = require("../controllers/Admincontroller");
const TrycatchMiddleware = require("../middlewares/Trycatchmiddleware");
const verifyToken=require('../middlewares/adminAuthMiddleware')





   
router.post("/login", TrycatchMiddleware(admincontroller.login))

.use(verifyToken)

.get("/users",TrycatchMiddleware(admincontroller.allusers))
.get("/users/:id",TrycatchMiddleware(admincontroller.getUserById))
.post("")


module.exports = router;      
   