import mongoose from "mongoose";

export const connectDB = async () =>{
    await mongoose.connect(process.env.MY_CONNECT_STRING).then(()=>{
        console.log("MongoDB connected successfully");
    })
};

