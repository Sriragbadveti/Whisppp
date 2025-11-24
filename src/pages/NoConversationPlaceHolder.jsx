import React from 'react'

function NoConversationPlaceHolder() {
  return (
    <div className="h-full flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-gray-500 text-lg font-medium">Select a conversation</p>
        <p className="text-gray-400 text-sm mt-2">Choose someone from the sidebar to start chatting</p>
      </div>
    </div>
  )
}

export default NoConversationPlaceHolder
