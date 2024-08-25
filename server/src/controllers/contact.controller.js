import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import mongoose from 'mongoose';

export const searchContact = async (req, res, next) => {
    try {
        const { search } = req.body;
    
        if (search === undefined && search === "") {
            return next(errorHandler(400, "SearchTerm is Required."));

        }
    
        const sanitizedSearchTerm = search.replace(/[.*+?^${}()[\]\\]/g, "\\$&");
    
        const regex = new RegExp(sanitizedSearchTerm, "i");
    
        const contact = await User.find({
            $and: [
                { _id: { $ne: req.userId } },
                {
                    $or: [
                        {
                            firstName: regex,
                        },
                        {
                            lastName: regex,
                        },
                        {
                            email: regex,
                        },
                    ],
                },
            ],
        }).select("-password");
    
        res
            .status(200)
            .json({ success: true, message: "Succesfully search contact", contact });
    } catch (error) {
        next(error);
    }
}

export const getContactsForDMlist = async (req, res, next) => {
    try {
        let { userId } = req;
  
        userId = new mongoose.Types.ObjectId(userId);
  
        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }],
                },
            },
            {
                $sort: { timestamp: -1 },
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender",
                        },
                    },
                    lastMessageTime: { $first: "$timeStamp" },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                },
            },
            {
                $unwind: "$contactInfo",
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color",
                },
            },
            {
                $sort: { lastMessageTime: -1 },
            },
        ]);
  
        res
            .status(200)
            .json({ success: true, message: "Succesfully get list.", contacts });
    } catch (error) {
        next(error);
    }
};

export const getAllContacts = async (req, res, next) => {
    try {
        const users = await User.find(
            { _id: { $ne: req.userId } },
            "firstName lastName _id email"
        );
  
        const contacts = users.map((user) => ({
            label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
            value:user._id
        }));
  
        res
            .status(200)
            .json({ success: true, message: "Succesfully search contact", contacts });
    } catch (error) {
        next(error);
    }
};