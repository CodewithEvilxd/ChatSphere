import { selectedChatData, selectedChatMessage, selectedChatType, setChatMessages, setFileDownloadingProgress, setIsDownloading } from '@/store/slices/chatSlice';
import React, { useRef,useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";
import { selectedUserData } from '@/store/slices/authSlice';
import axios from 'axios';
import ImageModal from './media/ImageModal';
import { Download, FileArchive, FileText, Music2, Play } from 'lucide-react';
import VideoModal from './media/VideoModal';
import MusicModal from './media/MusicModal';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getColor } from '@/lib/utils';
import { splitName } from './NewDm';

const MessageFragment = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const fragmentRef = useRef();
    const dispatch = useDispatch();
    const chatMessages = useSelector(selectedChatMessage);
    const chatType = useSelector(selectedChatType);
    const chatData = useSelector(selectedChatData);
    const userData = useSelector(selectedUserData);
    const [showImage, setShowImage] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [showVideo, setShowVideo] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [showMusic, setShowMusic] = useState(false);
    const [musicUrl, setMusicUrl] = useState("");

    console.log(imageUrl);
    
    console.log(chatMessages);
    
    useEffect(() => {
        if (fragmentRef.current) {
            fragmentRef.current.scrollTop = fragmentRef.current.scrollHeight;
        }
    }, [chatMessages]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await fetch(`${API_URL}/api/messages/get-messages`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: chatData._id }),
                    credentials: "include",
                });
        
                const data = await res.json();
        
                if (data.messages) {
                    dispatch(setChatMessages(data.messages));
                }
            } catch (error) {
                toast.error(error.message);
                // console.log(error);
            }
        };
    
        const getChannelMessage = async ()=>{
            try {
                const res = await fetch(
                  `${API_URL}/api/channel/get-channel-messages/` + chatData._id,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );
                const data = await res.json();
        
                if (res.ok) {
                    dispatch(setChatMessages(data.messages));
                }else{
                    throw new Error(data.errors)
                }
            } catch (error) {
            toast.error(error.message);
            }
        
        }

        if (chatData._id) {
            if (chatType === "contact") {
                getMessages();
            }else if (chatType === "channel") {
                getChannelMessage();
            }
        }
    }, [chatType, chatData]);

    
    const checkIfImage = (filePath) => {
        const imageRegex =/\.(jpg|jpeg|png|gif|svg|tif|ico|heif|heic|bmp|webp|tiff)$/i;
        return imageRegex.test(filePath);
    };
    const checkIfVideo = (filePath) => {
        const videoRegex = /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv|mpeg|mpg|3gp)$/i;
        return videoRegex.test(filePath);
    };
    const checkIfMusic = (filePath) => {
        const musicRegex = /\.(mp3|wav|ogg|flac|aac|wma|m4a|aiff|alac)$/i;
        return musicRegex.test(filePath);
    };
    
    const checkIfDocument = (filePath) => {
        const documentRegex = /\.(pdf|docx?|xlsx?|pptx?|txt|csv)$/i;
        return documentRegex.test(filePath);
    };
    
    const checkIfArchive = (filePath) => {
        const archiveRegex = /\.(rar|zip|7z|tar|gz|bz2)$/i;
        return archiveRegex.test(filePath);
    };
    
    const renderMessages = () => {
        let lastDate = null;
    
        return chatMessages.map((message, index) => {
            const messageDate = moment(message.timeStamp).format("YYYY-MM-DD");
            const showDate = messageDate !== lastDate;
            lastDate = messageDate;
    
            return (
                <div key={index}>
                    {showDate && (
                        <div className="text-center text-sm text-gray-500 my-2">
                        {moment(message.timeStamp).format("LL")}
                        </div>
                    )}
                    {chatType === "contact" && renderDmMessages(message)}
                    {chatType === "channel" && renderChannelMessages(message)}
                </div>
            );
        });
    };


    const handleDownloadFile = async (fileUrl) => {
        dispatch(setFileDownloadingProgress(0));
        try {
            dispatch(setIsDownloading(true));
            const res = await axios.get(fileUrl, {
                responseType: "blob",
                onDownloadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
        
                const percentComplated = Math.round((loaded * 100) / total);
        
                dispatch(setFileDownloadingProgress(percentComplated));
                },
            });
    
            const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = fileUrl.split("-").pop();
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("There was an error downloading the file:", error);
        } finally {
            dispatch(setIsDownloading(false));
        }
    };
    

    const renderDmMessages = (message) => (
        <div
            className={`${
                message.sender === chatData._id ? "text-left" : "text-right"
            } mt-1`}
        >
            {message.messageType === "text" && (
                <div
                    className={`${
                        message.sender !== chatData._id
                        ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                        : "bg-[#2e2b33]/5 text-white/80 border-[#ffffff]/20"
                    } border inline-block p-2.5 text-sm rounded my-1 max-w-[50%] break-wordss`}
                >
                    {message.content}
                </div>
            )}
            {message.messageType === "file" && (
                <div
                    className={`${
                        message.sender !== chatData._id
                        ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                        : "bg-[#2e2b33]/5 text-white/80 border-[#ffffff]/20"
                    } border inline-block p-4 rounded my-1 max-w-[70%] md:max-w-[100%] lg:max-w-[50%] break-wordss`}
                >
                    {checkIfImage(message.fileUrl) && (
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                setShowImage(true);
                                setImageUrl(message.fileUrl);
                            }}
                        >
                            <img src={message.fileUrl} height={200} width={200} alt="image" />
                        </div>
                    )}
                    {checkIfVideo(message.fileUrl) && (
                        <div
                        className="relative cursor-pointer"
                        onClick={() => {
                            setShowVideo(true);
                            setVideoUrl(message.fileUrl);
                        }}
                        >
                        <video width={220} height={220}>
                            <source src={message.fileUrl} type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <Play className="text-white w-5 h-5" />
                        </div>
                        </div>
                    )}
                    {checkIfMusic(message.fileUrl) && (
                        <div
                            className="relative bg-none flex-center flex-col cursor-pointer"
                            onClick={() => {
                                setShowMusic(true);
                                setMusicUrl(message.fileUrl);
                            }}
                        >
                            <div>
                                <Music2
                                    className="bg-none text-[#8417ff]"
                                    width={50}
                                    height={50}
                                />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center  bg-opacity-50">
                                <Play className="text-white w-5 h-5" />
                            </div>
                            <span className="text-sm mt-5">
                                {message.fileUrl.split("-").pop()}
                            </span>
                        </div>
                    )}
        
                    {checkIfDocument(message.fileUrl) && (
                        <div className="flex items-center justify-center gap-4">
                            <span className="text-white/8- text-3xl bg-black/20 rounded-full p-2">
                                <FileText height={16} width={16} />
                            </span>
                            <span className="text-sm">
                                {message.fileUrl.split("-").pop()}
                            </span>
                            <span
                                onClick={() => handleDownloadFile(message.fileUrl)}
                                className="bg-black/20 p-2  rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                            >
                                <Download height={16} width={16} />
                            </span>
                        </div>
                    )}
        
                    {checkIfArchive(message.fileUrl) && (
                        <div className="flex items-center justify-center gap-4">
                            <span className="text-white/8- text-3xl bg-black/20 rounded-full p-3">
                                <FileArchive height={16} width={16} />
                            </span>
                            <span className="text-sm">
                                {message.fileUrl.split("-").pop()}
                            </span>
                            <span
                                onClick={() => handleDownloadFile(message.fileUrl)}
                                className="bg-black/20 p-2 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                            >
                                <Download height={16} width={16} />
                            </span>
                        </div>
                    )}
                </div>
            )}
    
            <div className="text-xs text-gray-600">
                {moment(message.timeStamp).format("LT")}
            </div>
        </div>
    );
    
    const renderChannelMessages = (message) => {
        return (
            <div
                className={`mt-5 ${
                message.sender._id !== userData._id ? "text-left" : "text-right"
                }`}
            >
                {message.messageType === "text" && (
                <div
                    className={`${
                    message.sender !== chatData._id
                        ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                        : "bg-[#2e2b33]/5 text-white/80 border-[#ffffff]/20"
                    } border wore inline-block p-2.5 text-sm rounded my-1 max-w-[50%] break-wordss `}
                >
                    {message.content}
                </div>
                )}
                {message.messageType === "file" && (
                <div
                    className={`${
                    message.sender._id !== userData._id
                        ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                        : "bg-[#2e2b33]/5 text-white/80 border-[#ffffff]/20"
                    } border inline-block p-4 rounded my-1 max-w-[70%] md:max-w-[100%] lg:max-w-[50%] break-wordss`}
                >
                    {checkIfImage(message.fileUrl) && (
                    <div
                        className="cursor-pointer"
                        onClick={() => {
                        setShowImage(true);
                        setImageUrl(message.fileUrl);
                        }}
                    >
                        <img
                        src={message.fileUrl}
                        height={200}
                        width={200}
                        alt="image"
                        />
                    </div>
                    )}
                    {checkIfVideo(message.fileUrl) && (
                    <div
                        className="relative cursor-pointer"
                        onClick={() => {
                        setShowVideo(true);
                        setVideoUrl(message.fileUrl);
                        }}
                    >
                        <video width={220} height={220}>
                        <source src={message.fileUrl} type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <Play className="text-white w-5 h-5" />
                        </div>
                    </div>
                    )}
                    {checkIfMusic(message.fileUrl) && (
                    <div
                        className="relative bg-none flex-center flex-col cursor-pointer"
                        onClick={() => {
                        setShowMusic(true);
                        setMusicUrl(message.fileUrl);
                        }}
                    >
                        <div>
                        <Music2
                            className="bg-none text-[#8417ff]"
                            width={50}
                            height={50}
                        />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center  bg-opacity-50">
                        <Play className="text-white w-5 h-5" />
                        </div>
                        <span className="text-sm mt-5">
                        {message.fileUrl.split("-").pop()}
                        </span>
                    </div>
                    )}
        
                    {checkIfDocument(message.fileUrl) && (
                    <div className="flex items-center justify-center gap-4">
                        <span className="text-white/8- text-3xl bg-black/20 rounded-full p-3">
                        <FileText height={16} width={16} />
                        </span>
                        <span className="text-sm">
                        {message.fileUrl.split("-").pop()}
                        </span>
                        <span
                        onClick={() => handleDownloadFile(message.fileUrl)}
                        className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                        >
                        <Download height={16} width={16} />
                        </span>
                    </div>
                    )}
        
                    {checkIfArchive(message.fileUrl) && (
                    <div className="flex items-center justify-center gap-4">
                        <span className="text-white/8- text-3xl bg-black/20 rounded-full p-3">
                        <FileArchive height={16} width={16} />
                        </span>
                        <span className="text-sm">
                        {message.fileUrl.split("-").pop()}
                        </span>
                        <span
                        onClick={() => handleDownloadFile(message.fileUrl)}
                        className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                        >
                        <Download height={16} width={16} />
                        </span>
                    </div>
                    )}
                </div>
                )}
                {message.sender._id !== userData._id ? (
                <div className="flex items-center mt-1 justify-start gap-3">
                    <Avatar className="w-8 h-8 ">
                    {message.sender.image && (
                        <AvatarImage
                        src={message.sender.image}
                        alt="profile"
                        className="object-cover w-full rounded-full h-full bg-black"
                        loading="lazy"
                        />
                    )}
                    <AvatarFallback
                        className={`uppercase h-8 w-8 flex-center text-xs  flex-center rounded-full ${getColor(
                        message.sender.color
                        )}`}
                    >
                        {message.sender.firstName && message.sender.lastName
                        && splitName(message.sender.firstName, message.sender.lastName)}
                        
                    </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
                    <span className="text-xs text-white/60">
                    {moment(message.timeStamp).format("LT")}
                    </span>
                </div>
                ) : (
                <span className="text-xs block text-white/60 mt-1">
                    {moment(message.timeStamp).format("LT")}
                </span>
                )}
            </div>
        );
    };

    return (
        <div 
            className="flex-1 overflow-y-auto p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full"
            ref={fragmentRef}
        >
            {renderMessages()}
            {showImage && (
                <ImageModal
                    setShowImage={setShowImage}
                    setImageUrl={setImageUrl}
                    imageUrl={imageUrl}
                    handleDownloadFile={handleDownloadFile}
                />
            )}
            {showVideo && (
                <VideoModal
                    setShowVideo={setShowVideo}
                    videoUrl={videoUrl}
                    handleDownloadFile={handleDownloadFile}
                    setVideoUrl={setVideoUrl}
                />
            )}
            {showMusic && (
                <MusicModal
                    setShowMusic={setShowMusic}
                    musicURl={musicUrl}
                    handleDownloadFile={handleDownloadFile}
                    setMusicUrl={setMusicUrl}
                />
            )}
        </div>
    )
}

export default MessageFragment
