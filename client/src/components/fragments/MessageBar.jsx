import { useSocket } from "@/contexts/SocketContext";
import { selectedUserData } from "@/store/slices/authSlice";
import { selectedChatData, selectedChatType, setFileUploadingProgress, setIsUploading } from "@/store/slices/chatSlice";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { Paperclip, SendHorizonal, Sticker } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const MessageBar = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const emojiRef = useRef(null);
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    const [message, setMessage] = useState("");
    const [isEmojiPicker, setIsEmojiPicker] = useState(false);
    const chatData = useSelector(selectedChatData);
    const chatType = useSelector(selectedChatType);
    const userData = useSelector(selectedUserData);
    const socket = useSocket();

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (emojiRef.current && !emojiRef.current.contains(e.target)) {
                setIsEmojiPicker(false);
            }
        };
        

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isEmojiPicker]);

    const handleSendMessage = async () => {
        if (message.length !== 0) {
            if (chatType === "contact") {
                socket.emit("sendMessage", {
                    sender: userData._id,
                    recipient: chatData._id,
                    messageType: "text",
                    content: message,
                    fileUrl: undefined,
                });
            } else if (chatType === "channel") {
                socket.emit("sendMessage-channel", {
                    sender: userData._id,
                    content: message,
                    messageType: "text",
                    fileUrl: undefined,
                    channelId: chatData._id,
                });
            }
        }
    
        setMessage("");
    };
    

    const handleAttachmentClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleAttachmentChange = async (e) => {
        const file = e.target.files[0];
        const maxSize = 5 * 1024 * 1024; // 5 MB dalam bytes
    
        if (file && file.size > maxSize) {
            toast.error("File too large. Maximum size is 5MB.");
            return;
        }
    
        if (file) {
            dispatch(setIsUploading(true));
            dispatch(setFileUploadingProgress(0));
            const formData = new FormData();
            formData.append("file", file);
    
            try {
                const res = await axios.post(`${API_URL}/api/messages/upload-file`,
                    formData,
                    {
                        withCredentials: true,
                        onUploadProgress: (event) => {
                            const progress = Math.round((event.loaded * 100) / event.total);
                
                            dispatch(setFileUploadingProgress(progress));
                        },
                    }
                );
        
                if (res.status === 200) {
                    if (chatType === "contact") {
                        socket.emit("sendMessage", {
                            sender: userData._id,
                            recipient: chatData._id,
                            messageType: "file",
                            content: undefined,
                            fileUrl: res.data.filePath,
                        });
                    } else if (chatType === "channel") {
                            socket.emit("sendMessage-channel", {
                            sender: userData._id,
                            content: undefined,
                            messageType: "file",
                            fileUrl: res.data.filePath,
                            channelId: chatData._id,
                        });
                    }
                }
            } catch (error) {
                toast.error("Upload failed.");
            } finally {
                dispatch(setIsUploading(false));
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="h-[5vh] sm:h-[8vh] z-30 bg-[#1c1d25] flex-center  px-8 mb-2 gap-6">
            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center  md:gap-6 pr-5">
                <input
                    type="text"
                    className="w-full p-2.5 sm:p-3 text-sm bg-transparent rounded-md focus:border-none focus:outline-none"
                    placeholder="Enter Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button 
                    className="text-neutral-500 rounded-sm p-1 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                    onClick={handleAttachmentClick}
                >
                    <Paperclip className="w-5 h-5 sm:w-[23px] sm:h-[23px]"  />
                </button>
                <input
                    type="file"
                    id="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleAttachmentChange}
                />
                <div className="relative">
                    <button
                        onClick={() => setIsEmojiPicker(true)}
                        aria-label="emoji picker"
                        className="text-neutral-500 rounded-sm p-1 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                    >
                        <Sticker className="w-6 h-6 sm:w-[25px] sm:h-[25px]" />
                    </button>
                    <div className="absolute bottom-16 -right-24 sm:right-0" ref={emojiRef}>
                        <EmojiPicker
                            theme="dark"
                            open={isEmojiPicker}
                            onEmojiClick={handleAddEmoji}
                            autoFocusSearch={false}
                            searchDisabled={true}
                        />
                    </div>
                </div>
            </div>
            <button
                onClick={handleSendMessage}
                aria-label="send message"
                className="bg-[#8417ff] rounded-md flex-center p-2 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            >
                <SendHorizonal width={20} height={20} />
            </button>
        </div>
    );
};

export default MessageBar;