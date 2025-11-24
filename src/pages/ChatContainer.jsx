// CHATCONTAINER CODE COMMENTED OUT - NOW USING STREAM CHAT UI COMPONENTS INSTEAD
// This file is kept for reference but all functionality has been moved to StreamChatPage.jsx

/*
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useChatStore } from '../stores/useChatStore'
import { useAuthStore } from '../stores/useAuthStore'
import { Send, Image as ImageIcon, X } from 'lucide-react'
import toast from 'react-hot-toast'

function ChatContainer() {
  const { selectedUser, messages, isChatsLoading, getMessagesByUserId, sendMessage, subscribeMessages, unsubscribeMessages } = useChatStore();
  const { authUser, onlineUsers, socket } = useAuthStore();
  const isSelectedUserOnline = useMemo(() => selectedUser && onlineUsers.includes(selectedUser._id.toString()), [selectedUser, onlineUsers]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [messageText, setMessageText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const scrollTimeoutRef = useRef(null);

  const quickSuggestions = useMemo(() => ["Hey", "How are you?", "What's up?", "Hello!", "Nice to meet you"], []);

  useEffect(() => {
    if (selectedUser) {
      getMessagesByUserId(selectedUser._id);
    }
  }, [selectedUser, getMessagesByUserId]);

  // Subscribe to messages when user is selected and socket is connected
  useEffect(() => {
    if (selectedUser && socket && socket.connected && authUser) {
      subscribeMessages(socket, selectedUser, authUser);
    }

    // Cleanup: unsubscribe when component unmounts or user changes
    return () => {
      if (socket) {
        unsubscribeMessages(socket);
      }
    };
  }, [selectedUser, socket, authUser, subscribeMessages, unsubscribeMessages]);

  useEffect(() => {
    // Debounce scroll to improve performance
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages]);

  useEffect(() => {
    // Reset image when user changes
    setSelectedImage(null);
    setImagePreview(null);
    setMessageText('');
  }, [selectedUser]);

  const handleImageSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select an image file");
    }
  }, []);

  const removeImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const convertImageToBase64 = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!messageText.trim() && !selectedImage) return;

    const messageData = {
      text: messageText.trim() || undefined,
      image: selectedImage ? await convertImageToBase64(selectedImage) : undefined
    };

    await sendMessage(messageData, authUser);
    setMessageText('');
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [messageText, selectedImage, sendMessage, authUser, convertImageToBase64]);

  const handleQuickSuggestion = useCallback((suggestion) => {
    setMessageText(suggestion);
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  if (isChatsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-400 text-sm">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5">
              <div className="w-full h-full rounded-full bg-slate-800 overflow-hidden">
                <img
                  src={selectedUser?.profilePic || "/avatar.png"}
                  alt={selectedUser?.username}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {isSelectedUserOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
            )}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{selectedUser?.username}</h3>
            <p className="text-slate-400 text-xs">{isSelectedUserOnline ? "Online" : "Offline"}</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ willChange: 'scroll-position', transform: 'translateZ(0)' }}>
        {messages && messages.length > 0 ? (
          messages.map((msg) => {
            const isSentByMe = msg.senderId?.toString() === authUser?._id?.toString();
            
            return (
              <div
                key={msg._id}
                className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                style={{ contain: 'layout style paint' }}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isSentByMe
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'bg-slate-700/50 text-slate-200'
                  }`}
                >
                  {msg.text && (
                    <p className="text-sm break-words">{msg.text}</p>
                  )}
                  {msg.image && (
                    <div className="mt-2 rounded-lg overflow-hidden">
                      <img
                        src={msg.image}
                        alt="Message attachment"
                        className="max-w-full h-auto rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="text-center">
              <p className="text-slate-500 text-sm">No messages yet</p>
              <p className="text-slate-600 text-xs mt-1">Start the conversation</p>
            </div>
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSuggestion(suggestion)}
                  className="px-4 py-2 rounded-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white text-sm transition-colors duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="px-4 pt-2 border-t border-slate-700/50">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-32 rounded-lg"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-end gap-2">
          {/* Image Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors duration-200 flex-shrink-0"
          >
            <ImageIcon className="w-5 h-5 text-slate-400 hover:text-cyan-400 transition-colors" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none max-h-32 overflow-y-auto"
              style={{ willChange: 'contents' }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() && !selectedImage}
            className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatContainer
*/

// Placeholder component to prevent import errors
function ChatContainer() {
  return null;
}

export default ChatContainer;
