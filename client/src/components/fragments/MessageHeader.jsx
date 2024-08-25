import { closeChat, setChatData } from '@/store/slices/chatSlice';
import { X } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarImage } from '../ui/avatar';
import { getColor } from '@/lib/utils';
import { splitName } from './NewDm';

const MessageHeader = () => {
    const dispatch = useDispatch();
    const chatData = useSelector((state) => state.chat.chatData);
    const chatType = useSelector((state) => state.chat.chatType);

    const onlineUsers = useSelector((state) => state.users.onlineUsers);

    return (
        <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-between py-1 px-4 sm:px-20">
            <div className='flex gap-5 w-full justify-between items-center'>

                <div className='flex gap-3 items-center justify-center'>
                    <div className="w-10 h-10 rounded-full relative">
                        {chatType === "contact" ? (
                            <Avatar className="w-10 h-10 ">
                                {chatData.image ? (
                                    <AvatarImage
                                        src={chatData.image}
                                        alt="profile"
                                        className="object-cover w-full rounded-full h-full bg-black"
                                        loading="lazy"
                                    />
                                ) : (
                                <div
                                    className={`uppercase h-10 w-10 text-xs border flex-center rounded-full ${getColor(
                                        chatData.color
                                    )}`}
                                >
                                    {chatData.firstName && chatData.lastName
                                    ? splitName(chatData.firstName, chatData.lastName)
                                    : chatData.email.charAt(0)}
                                </div>
                                )}
                            </Avatar>
                        ) : (
                            <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                                #
                            </div>
                        )}
                    </div>
                        {chatType === "contact" ? (
                            <div className="flex items-start justify-center flex-col">
                                <span className="font-medium text-sm">
                                    {chatData.firstName
                                    ? `${chatData.firstName} ${chatData.lastName}`
                                    : chatData.email}
                                </span>
                                
                                <span className="text-xs mt-1">
                                    {onlineUsers[chatData._id] ? (
                                        <span className="tracking-wide">Online</span>
                                        ) : (
                                        <span className=" tracking-wide">Offline</span>
                                    )}
                                </span>
                            </div>
                        ) : (
                            <span className="mb-3">{chatData.name}</span>
                        )}
                </div>

                {/* closed button */}
                <div className="flex-center gap-5">
                    <button
                        onClick={() => {
                            dispatch(setChatData(undefined));
                            dispatch(closeChat());
                        }}
                        className="text-neutral-500 rounded-sm p-1 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                    >
                        <X width={25} height={25} />
                    </button>
                </div>

            </div>
        </div>
    )
}

export default MessageHeader
