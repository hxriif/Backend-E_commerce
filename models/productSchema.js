const mongoose=require('mongoose')
const produdctSchema=new mongoose.Schema({
    title:String,
    image:String,
    price:Number,
    category:String,
    description:String,
     
})
module.exports=("products",produdctSchema)