import mongoose from "mongoose";
import { errorHandler } from "../utils/error.js";
import Channel from "../models/channel.model.js";
import User from "../models/user.model.js";


export const createChannels = async (req, res, next) => {
    try {
        const { name, members } = req.body;
        // console.log("Received members:", members); // Log received members

        const userId = req.userId;

        if (!name || !members || !Array.isArray(members) || members.length === 0) {
            return next(errorHandler(400, "Invalid input: name and members are required."));
        }

        const validMembers = await User.find({ _id: { $in: members } });
        console.log("Valid members found:", validMembers.map(member => member._id)); // Log valid members

        if (validMembers.length !== members.length) {
            return next(errorHandler(400, "Some members are not valid users."));
        }

        const newChannel = new Channel({
            name,
            members,
            admin: userId,
        });

        await newChannel.save();

        res.status(201).json({
            success: true,
            message: "Successfully created channel",
            channel: newChannel,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

  

export const getChannels = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);

        const channel = await Channel.find({
            $or: [{ admin: userId }, { members: userId }],
        }).sort({ updatedAt: -1 });

        res.status(201).json({
            success: true,
            message: "Successfully get channel",
            channel,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getChannelMessages = async (req, res, next) => {
    try {
        const { channelId } = req.params;

        const channel = await Channel.findById(channelId).populate({
            path: "messages",
            populate: {
                path: "sender",
                select: "firstName lastName email _id image color",
            },
        });

        if (!channel) {
            
            return  next(errorHandler(400, "Channel is not found"));
        }

        const messages = channel.messages;

        res.status(200).json({ success: true, messages });
    } catch (error) {
        next(error);
    }
};
