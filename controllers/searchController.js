import Search from "../models/searchModel.js";


// get search suggestions
export const getSearchSuggestions = async (req,res)=>{
   try {
     const searchSuggestions = await Search.find().select('text');
     if(searchSuggestions){
        res.status(200).json({success:true,message:"Successfully got the search suggestion",searchSuggessionData:searchSuggestions});
     }
     else{
        res.status(404).json({success:false,message:"No search suggestion found"});
    }

   } catch (error) {
      res.status(500).json({success:false,message:"Internal server error"});
   }
}