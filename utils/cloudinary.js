import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name:process.env.MY_CLOUDINARY_CLOUD_NAME,
    api_key:process.env.MY_CLOUDINARY_API_KEY,
    api_secret:process.env.MY_CLOUDINARY_SECRET_KEY
})
export default cloudinary;