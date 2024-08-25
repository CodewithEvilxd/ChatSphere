import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatType: undefined,
    chatData: undefined,
    chatMessage: [],
    directMessagerContacts: [],
    isUploading: false,
    isDownloading: false,
    fileUploadingProgress: 0,
    fileDownloadingProgress: 0,
    channels: [],
    trigger: 1,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        addChannelInChannelList: (state, action) => {
            const channels = state.channels;
      
            const data = channels.find(
                (channel) => channel._id === action.payload.channelId
            );
      
            const index = channels.findIndex(
                (channel) => channel._id === action.payload.channelId
            );
      
            if (index !== -1) {
                channels.splice(index, 1);
                channels.unshift(data);
            }
        },
        addContactInDmContactList: (state, action) => {
            const { userId, message } = action.payload;
      
            const fromId =message.sender._id === userId
                ? message.recipient._id
                : message.sender._id;
            const fromData = message.sender._id === userId ? message.recipient : message.sender;
      
            const dmContact = [...state.directMessagerContacts];
            const index = dmContact.findIndex((contact) => contact._id === fromId);
      
            if (index !== -1) {
                const [existingContact] = dmContact.splice(index, 1);
                dmContact.unshift(existingContact);
            } else {
                dmContact.unshift(fromData);
            }
      
            state.directMessagerContacts = dmContact;
        },
        setChannel: (state, action) => {
            state.channels = action.payload;
        },
        setTrigger: (state, action) => {
            state.trigger += 1;
        },
        addChannel: (state, action) => {
            state.channels.unshift(action.payload);
        },
        setIsUploading: (state, action) => {
            state.isUploading = action.payload;
        },
        setIsDownloading: (state, action) => {
            state.isDownloading = action.payload;
        },
        setFileUploadingProgress: (state, action) => {
            state.fileUploadingProgress = action.payload;
        },
        setFileDownloadingProgress: (state, action) => {
            state.fileDownloadingProgress = action.payload;
        },
        setChatType: (state, action) => {
            state.chatType = action.payload;
        },
        setChatData: (state, action) => {
            state.chatData = action.payload;
        },
        setChatMessages: (state, action) => {
            state.chatMessage = action.payload;
        },
        setDirectMessagerContact: (state, action) => {
            state.directMessagerContacts = action.payload;
        },
        addMessage: (state, action) => {
            const { chatType } = state;
            const message = action.payload;
      
            const newMessage = {
                ...message,
                recipient:chatType === "channel" ? message.recipient : message.recipient._id,
                sender: chatType === "channel" ? message.sender : message.sender._id,
            };

            state.chatMessage.push(newMessage);
        },
        closeChat: (state) => {
            state.chatType = undefined;
            state.chatMessage = undefined;
            state.chatMessage = [];
        },
    },
});

export const { 
    setChatType, 
    closeChat, 
    setChatData, 
    setChatMessages ,
    setDirectMessagerContact,
    addMessage,
    setFileDownloadingProgress,
    setFileUploadingProgress,
    setIsDownloading,
    setIsUploading,
    addChannel,
    setChannel,
    addChannelInChannelList,
    setTrigger,
    addContactInDmContactList
} = chatSlice.actions;
export default chatSlice.reducer;

export const selectedChatData = (state) => state.chat.chatData;
export const selectedChatType = (state) => state.chat.chatType;
export const selectedChatMessage = (state) => state.chat.chatMessage;
export const selectedDirectMessageContacts = (state) =>state.chat.directMessagerContacts;
export const selectedIsUploading = (state) => state.chat.isUploading;
export const selectedIsDownloading = (state) => state.chat.isDownloading;
export const selectedFileDownloadingProgress = (state) =>state.chat.fileDownloadingProgress;
export const selectedFileUploadingProgress = (state) =>state.chat.fileUploadingProgress;
export const selectedChannels = (state) => state.chat.channels;
export const selectedTrigger = (state) => state.chat.trigger;
