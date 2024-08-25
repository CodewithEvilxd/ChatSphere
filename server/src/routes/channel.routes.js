import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    createChannels,
    getChannelMessages,
    getChannels,
} from "../controllers/channel.controller.js";

const channelRoutes = express.Router();

channelRoutes.post("/create-channel", verifyToken, createChannels);
channelRoutes.get("/get-channel", verifyToken, getChannels);
channelRoutes.get(
    "/get-channel-messages/:channelId",
    verifyToken,
    getChannelMessages
);

export default channelRoutes;
