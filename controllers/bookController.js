import { bookModel } from "../models/bookModel.js";
import cloudinary from "../utils/cloudinary.js";
import reviewModel from "../models/reviewModel.js"; // make sure this path is correct
import Search from "../models/searchModel.js";

// add a Book
export const addBook = async (req, res) => {
  try {
    const { title, genre, author, price, description, coverImage } = req.body;

    if (!title || !genre || !author || !price || !description) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingBook = await bookModel.findOne({ title });
    if (existingBook) {
      return res.status(400).json({ success: false, message: "Book title already exists" });
    }

    const bookData = { title, genre, author, price, description };
    console.log("Before Image uploading")
    if (coverImage && coverImage.startsWith('data:image')) {
       const img = await cloudinary.uploader.upload(coverImage);
        bookData.coverImage = img.secure_url;
   }
   console.log("After image uploading");
    const newBook = await bookModel.create(bookData);

    const searchTitle = await Search.find({text:title});
    if(!searchTitle){
       await Search.create({text:title});
    }
    const searchAuthor = await Search.find({text:author});
    if(!searchAuthor){
       await Search.create({text:author});
    }
    const searchGenre = await Search.find({text:genre});
    if(!searchGenre){
       await Search.create({text:genre});
    }

    res.status(201).json({ success: true, bookData: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Book creation failed", success: false });
  }
};


// update a Book
export const updateBook = async (req, res) => {
  try {
    const { title, genre, price, description, author, coverImage } = req.body;
    const book = await bookModel.findOne({ title });

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    const updateFields = { title, genre, price, description, author };

    if (coverImage) {
      const img = await cloudinary.uploader.upload(coverImage, { folder: 'books' });
      updateFields.coverImage = img.secure_url;
    }

    const updatedBook = await bookModel.findByIdAndUpdate(book._id, updateFields, { new: true });

    res.status(200).json({ success: true, bookData: updatedBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};


// add rating
export const addRating = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { rating } = req.body;
    console.log(rating)

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5", success: false });
    }

    const book = await bookModel.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found", success: false });

    const totalRating = book.rating * book.ratingNumber;
    const newRatingNumber = book.ratingNumber + 1;
    const newAverage = (totalRating + rating) / newRatingNumber;

    const updatedBook = await bookModel.findByIdAndUpdate(
      bookId,
      {
        rating: newAverage,
        ratingNumber: newRatingNumber,
      },
      { new: true }
    );

    res.json({ success: true, bookData: updatedBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add rating", success: false });
  }
};



// delete book with review
export const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Delete the book
    const book = await bookModel.findByIdAndDelete(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    // Delete associated reviews
    await reviewModel.deleteMany({bookId});

    res.status(200).json({
      success: true,
      message: "Book and associated reviews deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting book and reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete book and its reviews",
    });
  }
};


// get books
export const getAllBooks = async (req, res) => {
  try {
    const books = await bookModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      bookData: books,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch books" });
  }
};


// get a book
export const getBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await bookModel.findById(bookId);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.status(200).json({ success: true, bookData: book });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve book", success: false });
  }
};

