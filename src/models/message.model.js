import mongoose from "mongoose";



const messageSchema =new mongoose.Schema({
    content:{type:String},
    senderId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    chatId:{type:mongoose.Schema.Types.ObjectId,ref:"Chat"},
    attachement:[]
},{timestamps:true});



export const Message = mongoose.model("Message",messageSchema);