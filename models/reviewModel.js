import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "books",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // users who liked the review
    },
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // users who disliked the review
    },
  ],
}, {
  timestamps: true,
});

const reviewModel = mongoose.models.reviews || mongoose.model("reviews", reviewSchema);

export default reviewModel;
