import mongoose, { mongo } from "mongoose";



const requestSchema = new mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    receiver:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    status:{type:String,default:"pending",enum:['pending','accepted','rejected']}
});



export const Request = await mongoose.model("Request",requestSchema);