import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import bookRouter from './routes/bookRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import searchRouter from './routes/searchRoute.js';


const app = express();

// MongoDB connection
connectDB();

// Middlewares
app.use(cors({
  origin: 'https://book-store-frontend-git-main-ghanshyam-patidars-projects.vercel.app', // frontend URL
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/auth', userRouter);
app.use('/api/book', bookRouter);
app.use('/api/review', reviewRouter);
app.use('/api/search', searchRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
