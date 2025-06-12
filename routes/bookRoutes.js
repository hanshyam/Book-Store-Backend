import express from 'express';
import {
  addBook,
  addRating,
  deleteBook,
  getAllBooks,
  getBook,
  updateBook,
} from '../controllers/bookController.js';

import { verifyUser, isAdmin } from '../middlewares/validateJwtToken.js';

const router = express.Router();

// Public routes
router.get('/', getAllBooks);
router.get('/:id', getBook);

// Protected routes
router.post('/', verifyUser, isAdmin, addBook);
router.put('/:id', verifyUser, isAdmin, updateBook);
router.delete('/:id', verifyUser, isAdmin, deleteBook);

// Rating can be given by any authenticated user
router.put('/rate/:id', verifyUser, addRating);

export default router;
