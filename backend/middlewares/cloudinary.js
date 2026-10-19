import {v2 as cloudinary} from "cloudinary"
import "dotenv/config";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary-v2";

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudinaryStorage= new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"striveBlog",
        allowed_formats:["png", "jpg", "jpeg"]
    }
});

const uploadImg= multer({
    storage:cloudinaryStorage
})

export default uploadImg