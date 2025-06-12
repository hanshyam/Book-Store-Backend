import express from 'express';
import { checkUser, loginUser, registerUser } from '../controllers/userController.js';
import { verifyUser } from '../middlewares/validateJwtToken.js';

const router = express.Router();

router.post('/login',loginUser);
router.post('/register',registerUser);
router.get('/check',verifyUser,checkUser);

export default router;