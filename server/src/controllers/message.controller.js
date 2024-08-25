import Message from "../models/message.model.js";
import { errorHandler } from "../utils/error.js";
import cloudinary from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getMessage = async (req, res, next) => {
    try {
        const user1 = req.userId;
        const user2 = req.body.id;

        if (!user1 || !user2) {
            return  next(errorHandler(400,"Both user Id's are required"));
        }

        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 },
            ],
        }).sort({ timestamp: 1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        next(error);
    }
};

export const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(errorHandler(400, "File is required"));
        }

        const file = req.file;

        // Upload the file to Cloudinary
        const result = await cloudinary.v2.uploader.upload(file.path, {
            folder: "chat_files",
            resource_type: "auto", // This allows all file types (e.g., images, videos, documents)
        });

        // Clean up the local file after successful upload
        fs.unlinkSync(file.path);

        res.status(200).json({
            success: true,
            message: "Successfully uploaded file.",
            filePath: result.secure_url,
        });
    } catch (error) {
        next(error);
    }
};