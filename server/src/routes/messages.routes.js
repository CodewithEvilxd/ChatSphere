import express from 'express';
import {verifyToken} from '../middlewares/auth.middleware.js'
import {getMessage, uploadFile} from '../controllers/message.controller.js'
import { upload } from "../utils/multer.js";
2
const messageRoutes = express.Router();

messageRoutes.post("/get-messages",verifyToken,getMessage);
messageRoutes.post(
    "/upload-file",
    verifyToken,
    upload.single("file"),
    uploadFile
);

export default messageRoutes;
