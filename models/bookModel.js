import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    genre:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        default:0.0
    },
    ratingNumber:{
       type:Number,
       default:0
    },
    price:{
        type:Number,
        required:true
    },
    coverImage:{
        type:String,
    },
    description:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

export const bookModel = mongoose.models.books || mongoose.model('books',bookSchema);
