import React from 'react'
import MessageHeader from '../fragments/MessageHeader'
import MessageFragment from '../fragments/MessageFragment'
import MessageBar from '../fragments/MessageBar'

const ChatLayout = () => {
    return (
        <div className="fixed top-0 h-screen w-screen bg-template flex flex-col md:static md:flex-1">
            <MessageHeader />
            <MessageFragment />
            <MessageBar />
        </div>
    )
}

export default ChatLayout
