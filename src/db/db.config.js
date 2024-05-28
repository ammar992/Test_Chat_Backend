import mongoose from "mongoose"
import { DB_NAME } from "../../constant.js"



export const connectDB = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("mongodb connected");
    } catch (error) {
        console.log("mongodb conncetion error",error.message);
    }
}

