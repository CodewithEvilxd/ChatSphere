import { Server as sockerIOServer } from "socket.io";
import Message from "./src/models/message.model.js";
import Channel from "./src/models/channel.model.js"
import dotenv from "dotenv";
dotenv.config();


const setupSocket = (server) =>{

    const io = new sockerIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    
    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log("disconnect", socket.id);
    
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                io.emit("userStatus", { userId, status: "offline" });
                userSocketMap.forEach((socketId, existingUserId) => {
                    if (existingUserId !== userId) {
                        io.to(socket.id).emit("userStatus", {
                        userId: existingUserId,
                        status: "offline",
                        });
                    }
                });
                userSocketMap.delete(userId);
                break;
            }
        }
    };

    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);
    
        const createdMessage = new Message(message);
        await createdMessage.save();
    
        // Find the saved message and populate the fields
        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id firstName lastName email image color")
            .populate("recipient", "id firstName lastName email image color");
    
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage", messageData);
            io.to(recipientSocketId).emit("dm-created", messageData);
            console.log("Message sent to recipient:", messageData);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessage", messageData);
            console.log("Message sent to sender:", messageData);
        }
    };

    const sendMessageChannel = async (message) => {
        const { channelId, sender, content, messageType, fileUrl } = message;
    
        try {

        
            const createdMessage = await Message.create({
                sender,
                recipient: null,
                content,
                messageType,
                timeStamp: new Date(),
                fileUrl,
            });
    
            const messageData = await Message.findById(createdMessage.id)
                .populate("sender", "id email firstName lastName image color")
                .exec();
    
          
            await Channel.findByIdAndUpdate(channelId, {
                $push: { messages: createdMessage._id },
            });
    
          
            const channel = await Channel.findById(channelId).populate(
                "members admin"
            );
    
            const finalData = { ...messageData._doc, channelId: channel._id };
    
            if (channel && channel.members) {
                channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
        
                if (memberSocketId) {
                    io.to(memberSocketId).emit("receive-channel-message", finalData);
                }
                });
        
                const adminSocketId = userSocketMap.get(channel.admin._id.toString());
        
                if (adminSocketId) {
                io.to(adminSocketId).emit("receive-channel-message", finalData);
                }
            }
        } catch (error) {
            console.error("Error sending channel message:", error);
        }
    };

    const sendChannel = async (channel) => {
        const { members, _id } = channel;
    
        try {
            const channelData = await Channel.findById(_id);
        
            members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member.toString());
        
                if (memberSocketId) {
                    io.to(memberSocketId).emit("newChannel", channelData);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };
    

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
    
        if (userId) {
            userSocketMap.set(userId, socket.id);
            io.emit("userStatus", { userId, status: "online" });

            console.log("User connected",userId, socket.id);

            userSocketMap.forEach((socketId, existingUserId) => {
                if (existingUserId !== userId) {
                    io.to(socket.id).emit("userStatus", {
                        userId: existingUserId,
                        status: "online",
                    });
                }
            });

            socket.on("channelCreated", sendChannel);

            socket.on("sendMessage", sendMessage);
            socket.on("sendMessage-channel", sendMessageChannel);
            socket.on("disconnect", () => disconnect(socket));
        } else {
            console.log("userid not provided deuring connectionerror");
        }   
        
    });
}

export default setupSocket;