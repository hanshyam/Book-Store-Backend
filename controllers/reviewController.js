import reviewModel from "../models/reviewModel.js";

// Add review 
export const addReview = async (req,res)=>{
    try{
       const bookId = req.params.id;
       const userId = req.user._id;
       const {content} = req.body;
       console.log("User Id: ",userId);
       

       const review = await reviewModel.create({
        userId:userId,
        bookId,
        content
       });
       res.status(200).json({success:true,reviewData:review});
    }catch(error){
        console.log(error);
    }
};

// delete review 
export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id; // Fixed typo
    const userId = req.user._id;

    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== userId.toString()) {
      return res.status(401).json({ message: "You are not authorized to delete this review", success: false });
    }

    await reviewModel.findByIdAndDelete(reviewId);
    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// add likes
export const addLike = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviewId = req.params.id;

    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const userIdStr = userId.toString();

    const alreadyLiked = review.likes.some(id => id.toString() === userIdStr);
    const alreadyDisliked = review.dislikes.some(id => id.toString() === userIdStr);

    if (alreadyLiked) {
      // Toggle off like
      review.likes = review.likes.filter(id => id.toString() !== userIdStr);
      await review.save();
      return res.status(200).json({
        message: 'Like removed',
        likesCount: review.likes.length,
        dislikesCount: review.dislikes.length,
      });
    } else {
      // Remove dislike if present
      if (alreadyDisliked) {
        review.dislikes = review.dislikes.filter(id => id.toString() !== userIdStr);
      }

      // Add like
      review.likes.push(userId);
      await review.save();
      return res.status(200).json({
        message: 'Review liked',
        likesCount: review.likes.length,
        dislikesCount: review.dislikes.length,
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// add dislikes 
export const addDislike = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviewId = req.params.id;

    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const userIdStr = userId.toString();

    const alreadyDisliked = review.dislikes.some(id => id.toString() === userIdStr);
    const alreadyLiked = review.likes.some(id => id.toString() === userIdStr);

    if (alreadyDisliked) {
      // Toggle off dislike
      review.dislikes = review.dislikes.filter(id => id.toString() !== userIdStr);
      await review.save();
      return res.status(200).json({
        message: 'Dislike removed',
        likesCount: review.likes.length,
        dislikesCount: review.dislikes.length,
      });
    } else {
      // Remove like if present
      if (alreadyLiked) {
        review.likes = review.likes.filter(id => id.toString() !== userIdStr);
      }

      // Add dislike
      review.dislikes.push(userId);
      await review.save();
      return res.status(200).json({
        message: 'Review disliked',
        likesCount: review.likes.length,
        dislikesCount: review.dislikes.length,
      });
    }
  } catch (error) {
    console.error('Error toggling dislike:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// get reviews
export const getReviews = async (req, res) => {
  try {
    const bookId = req.params.id;
    const reviews = await reviewModel.find({ bookId }).populate('userId', 'fullName');

    if (reviews && reviews.length > 0) {
      return res.status(200).json({ success: true, reviewData: reviews });
    }

    return res.status(404).json({ success: false, message: "No reviews found for this book" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
