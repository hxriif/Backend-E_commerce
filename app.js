// importing {express,assigning express to {app},defining {port},importing mongoose to {mongoose}}
require("dotenv").config();
const express = require("express");
const app = express();
const port = 6000;
const mongoose = require("mongoose");
const adminroute = require("./Routes/Adminrout");
const userroute=require("./Routes/userRouter")

// connection to mongoDB {start}
const mongoDB = "mongodb://127.0.0.1:27017/E-commerce-fullstack";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log("mongoDB connected");
}       
// {end}
app.use(express.json());     
app.use("/api/admin", adminroute);
app.use("/api/users",userroute)

// defining server where to listen{port}
app.listen(port, (err) => {
  if (err) {     
    console.log(`error detected ${err}`);
  }
  console.log(`server is running on port${port}`);
});
//   {end}
