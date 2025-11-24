import React, { useEffect, useMemo } from 'react'
import { useChatStore } from '../stores/useChatStore'
import { useAuthStore } from '../stores/useAuthStore'
import { MessageCircle } from 'lucide-react'

const ChatItem = React.memo(({ chat, onlineUsers, toggleUser, selectedUser }) => {
  const isOnline = useMemo(() => onlineUsers.includes(chat._id.toString()), [onlineUsers, chat._id]);
  const isSelected = useMemo(() => selectedUser?._id === chat._id, [selectedUser, chat._id]);
  
  return (
    <div
      onClick={() => toggleUser(chat)}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 group
        ${isSelected ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg text-white' : 'bg-white hover:bg-gray-50 border border-gray-200'}`}
      style={{ contain: 'layout style paint' }}
    >
      {/* User Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5">
          <div className="w-full h-full rounded-full bg-white overflow-hidden">
            <img
              src={chat.profilePic || "/avatar.png"}
              alt={chat.username}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
        {/* Online Status */}
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium text-sm truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>{chat.username}</h3>
        <p className={`text-xs truncate ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>Click to open chat</p>
      </div>

      {/* Message Icon */}
      <MessageCircle className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-cyan-500'} transition-colors duration-200 flex-shrink-0`} />
    </div>
  );
});

ChatItem.displayName = 'ChatItem';

function ChatsList() {
  const { chats, isChatsLoading, getMyChatPartners, toggleUser, selectedUser } = useChatStore();
  const { onlineUsers, socket } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  // Refresh chats when a new message is received
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = () => {
      // Refresh chat list when a new message arrives
      getMyChatPartners();
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, getMyChatPartners]);

  if (isChatsLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">Loading chats...</p>
      </div>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">No active chats</p>
        <p className="text-gray-400 text-xs mt-1">Start a conversation to see chats here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2" style={{ willChange: 'contents' }}>
      {chats.map((chat) => (
        <ChatItem key={chat._id} chat={chat} onlineUsers={onlineUsers} toggleUser={toggleUser} selectedUser={selectedUser} />
      ))}
    </div>
  )
}

export default ChatsList
