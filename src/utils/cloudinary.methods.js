import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const cloudinaryUpload = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // If file has been uploaded successfully then remove it on from local server
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log(error);
    // Remove from local if operation is failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};
