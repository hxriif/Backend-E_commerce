const express = require("express");
const router = express.Router();
const admincontroller = require("../controllers/Admincontroller");
const TrycatchMiddleware = require("../middlewares/Trycatchmiddleware");

router.post("/login", TrycatchMiddleware(admincontroller.login));

module.exports = router;
