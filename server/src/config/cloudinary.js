import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log("Cloudinary config:", process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY);

// The ! after process.env.XYZ in TypeScript is called the non-null assertion operator.
// It tells TypeScript that you are sure that the value will not be null or undefined.
export default cloudinary;
