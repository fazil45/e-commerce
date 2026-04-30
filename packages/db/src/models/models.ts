import mongoose, {  Schema } from "mongoose";

const productSchema = new Schema({
    name:{type: String, required:true},
    description:{type:String, required:true},
    price:{type:Number,required:true},
    image:{type:Array,required:true},
    category:{type:String,required:true},
    subCategory:{type:String,required:true},
    sizes:{type:String,required:true},
    bestseller:{type:Boolean},
    date:{type:Number,required:true}
})

const userSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    cartData:{type:Object,default:{}}
},{minimize:false})

export const productModel = mongoose.models.product || mongoose.model("product",productSchema)
export const userModel = mongoose.models.user || mongoose.model("user",userSchema)