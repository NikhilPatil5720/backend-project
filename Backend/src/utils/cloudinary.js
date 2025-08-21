import dotenv from "dotenv";
dotenv.config(); // ✅ Make sure env is loaded even if index.js misses it


import { v2 as cloudinary } from 'cloudinary';
import { promises as fs } from "fs"; // use fs.promises

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API, 
    api_secret: process.env.CLOUD_SECRET
});

const uploadoncloudinary = async function (localfilepath) {
    try {
        if (!localfilepath) return null;

        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto"
        });

        console.log("✅ File uploaded to Cloudinary:", response.url);

        // Delete file after successful upload
        await fs.unlink(localfilepath);

        return response;
    } catch (error) {
        console.error("❌ Cloudinary upload failed:", error);

        // Attempt to delete local file anyway
        await fs.unlink(localfilepath).catch(err => {
            console.warn("⚠️ Could not delete local file:", err.message);
        });

        return null;
    }
}

export { uploadoncloudinary };
