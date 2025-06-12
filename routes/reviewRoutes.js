import express from 'express';
import {
  addReview,
  deleteReview,
  addLike,
  addDislike,
  getReviews
} from '../controllers/reviewController.js';

import { verifyUser, isAdmin } from '../middlewares/validateJwtToken.js';

const router = express.Router();

router.post('/:id', verifyUser, addReview);
router.delete('/:id', verifyUser, deleteReview);
router.put('/like/:id', verifyUser, addLike);
router.put('/dislike/:id', verifyUser, addDislike);
router.get('/:id', getReviews);

export default router;
