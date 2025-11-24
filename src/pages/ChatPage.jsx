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
    <div className='w-full min-h-screen flex items-center justify-center p-4'>
      {/* Main Container with Moving Border Animation */}
      <div className="relative w-full max-w-7xl mx-auto">
        <div className="relative backdrop-blur-xl bg-slate-800/40 border-2 border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden border-animated">
          <div className="flex flex-col lg:flex-row h-[800px]">
            {/* LEFT SIDEBAR */}
            <div className='w-full lg:w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col border-r border-slate-700/50'>
              <ProfileHeader/>
              <ActiveTabSwitch activeTab={activeTab} setActiveTab={setActiveTab}/>
              
              <div className='flex-1 overflow-y-auto p-4 space-y-2' style={{ willChange: 'scroll-position', transform: 'translateZ(0)' }}>
                {activeTab === "chats" ? <ChatsList/> : <ContactList/>}
              </div>
            </div>

            {/* RIGHT SIDE - Chat Container */}
            <div className='flex flex-1 flex-col bg-slate-900/50 backdrop-blur-sm'>
              {/* {selectedUser ? <ChatContainer/> : <NoConversationPlaceHolder />} */}
              {/* Commented out ChatContainer - using Stream Chat UI instead */}
              {selectedUser ? <StreamChatPage/> : <NoConversationPlaceHolder />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
