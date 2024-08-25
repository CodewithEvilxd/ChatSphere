import ChatLayout from '@/components/layouts/ChatLayout';
import ContactLayout from '@/components/layouts/ContactLayout';
import EmptyChatLayout from '@/components/layouts/EmptyChatLayout';
import { selectedUserData } from '@/store/slices/authSlice.js'
import { selectedChatType, selectedFileDownloadingProgress, selectedFileUploadingProgress, selectedIsDownloading, selectedIsUploading } from '@/store/slices/chatSlice';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Chat = () => {

    const userData = useSelector(selectedUserData);
    const navigate = useNavigate();
    const chatType = useSelector(selectedChatType);
    const isUploading = useSelector(selectedIsUploading);
    const isDownloading = useSelector(selectedIsDownloading);
    const fileUploadingProgress = useSelector(selectedFileUploadingProgress);
    const fileDownloadingProgress = useSelector(selectedFileDownloadingProgress);



    useEffect(()=>{
        if(!userData.profileSetup){
            toast.error("Please setup profile to continue.");
            navigate("/profile")
        }
    },[userData,navigate])

    return (
        <main className="flex h-screen text-white overflow-hidden">
            {isUploading && (
                <div className="h-[100vh] w-[100vw] fixed top-0 z-[9999] left-0 bg-black/80 flex-center flex-col gap-5 backdrop-blur-lg">
                    <h5 className="text-5xl animate-pulse">Uploading File</h5>
                    <span>{fileUploadingProgress}%</span>
                </div>
            )}
            {isDownloading && (
                <div className="h-[100vh] w-[100vw] fixed top-0 z-[9999] left-0 bg-black/80 flex-center flex-col gap-5 backdrop-blur-lg">
                    <h5 className="text-5xl animate-pulse">Downloading File</h5>
                    <span>{fileDownloadingProgress}%</span>
                </div>
            )}
            <ContactLayout/>
            {chatType === undefined ? <EmptyChatLayout /> : <ChatLayout />}
            
        </main>
    )
}

export default Chat
