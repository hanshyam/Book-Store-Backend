import express from 'express'
import { getSearchSuggestions } from '../controllers/searchController.js';

const router = express.Router();

// Api calls
router.get('/',getSearchSuggestions);

export default router;