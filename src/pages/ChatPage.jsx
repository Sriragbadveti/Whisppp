import React, { useState } from 'react'
import ContactList from './ContactList'
import ChatsList from './ChatsList'
import ProfileHeader from './ProfileHeader'
import ActiveTabSwitch from './ActiveTabSwitch'
// import ChatContainer from './ChatContainer' // Commented out - using Stream Chat UI instead
import StreamChatPage from './StreamChatPage'
import NoConversationPlaceHolder from './NoConversationPlaceHolder'
import { useChatStore } from '../stores/useChatStore'

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState("chats");
  const { selectedUser } = useChatStore();

  return (
    <div className='w-full h-screen flex overflow-hidden bg-white'>
      {/* LEFT SIDEBAR */}
      <div className='w-80 bg-gray-50 flex flex-col border-r border-gray-200 flex-shrink-0'>
        <ProfileHeader/>
        <ActiveTabSwitch activeTab={activeTab} setActiveTab={setActiveTab}/>
        
        <div className='flex-1 overflow-y-auto p-4 space-y-2' style={{ willChange: 'scroll-position', transform: 'translateZ(0)' }}>
          {activeTab === "chats" ? <ChatsList/> : <ContactList/>}
        </div>
      </div>

      {/* RIGHT SIDE - Chat Container */}
      <div className='flex flex-1 flex-col bg-white overflow-hidden'>
        {selectedUser ? <StreamChatPage/> : <NoConversationPlaceHolder />}
      </div>
    </div>
  )
}

export default ChatPage
