import mongoose from "mongoose";

const searchSchema = new mongoose.Schema({
    text:{
       type:String, 
       required:true,
       unique:true
    }
},{
    timestamps: true
});

const Search = mongoose.model("searchs", searchSchema);
export default Search;