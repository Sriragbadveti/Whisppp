import React, { useEffect, useState } from 'react'
import { StreamChat } from "stream-chat";
import { Chat, Channel, Window, ChannelHeader, MessageList, MessageInput, Thread } from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import { useAuthStore } from '../stores/useAuthStore';
import { useChatStore } from '../stores/useChatStore';
import { Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function StreamChatPage() {
    const { authUser } = useAuthStore();
    const { selectedUser, getStreamToken, streamToken } = useChatStore();
    const navigate = useNavigate();
    
    const [client, setClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);

    // Initialize Stream Chat client
    useEffect(() => {
        if (!authUser || !import.meta.env.VITE_STREAM_API_KEY) {
            return;
        }

        const streamClient = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
        setClient(streamClient);

        return () => {
            // Cleanup: disconnect user when component unmounts
            if (streamClient) {
                streamClient.disconnectUser().catch(() => {});
            }
        };
    }, [authUser]);

    // Retrieve stream token when component mounts or authUser changes
    useEffect(() => {
        if (authUser && !streamToken) {
            getStreamToken().catch(() => {});
        }
    }, [authUser, streamToken, getStreamToken]);

    // Connect user to Stream and retrieve token
    useEffect(() => {
        if (!client || !authUser || !streamToken) return;

        const connectUser = async () => {
            try {
                setIsConnecting(true);
                
                // Ensure user ID is a string and matches token
                const userId = authUser._id.toString();
                
                // Connect user with token - user ID must match token's user_id
                await client.connectUser(
                    {
                        id: userId,
                        name: authUser.username || 'User',
                        image: authUser.profilePic || undefined,
                    },
                    streamToken
                );

                setIsConnecting(false);
            } catch (error) {
                toast.error("Failed to connect to chat");
                setIsConnecting(false);
            }
        };

        connectUser();
    }, [client, authUser, streamToken]);

    // Create and watch channel when user is selected
    useEffect(() => {
        // Wait for client to be connected (userID is set after connectUser)
        if (!client || !authUser || !selectedUser || !streamToken || isConnecting || !client.userID) {
            setChannel(null);
            return;
        }

        const setupChannel = async () => {
            try {
                // Create channel ID from both user IDs (sorted for consistency)
                const channelId = [authUser._id.toString(), selectedUser._id.toString()]
                    .sort()
                    .join("-");

                // Create or get channel
                const newChannel = client.channel("messaging", channelId, {
                    members: [authUser._id.toString(), selectedUser._id.toString()],
                    name: `${authUser.username} & ${selectedUser.username}`,
                });

                // Watch the channel
                await newChannel.watch();
                
                return newChannel;
            } catch (error) {
                toast.error("Failed to load chat: " + error.message);
                return null;
            }
        };

        let isCancelled = false;
        setupChannel().then((newChannel) => {
            if (!isCancelled && newChannel) {
                setChannel(newChannel);
            }
        }).catch(() => {});

        // Cleanup: stop watching channel when selectedUser changes
        return () => {
            isCancelled = true;
            if (channel) {
                channel.stopWatching().catch(() => {});
            }
            setChannel(null);
        };
    }, [client, authUser, selectedUser, streamToken, isConnecting]);

    // Handle video call - navigate to video call route
    const handleStartVideoCall = () => {
        if (!authUser || !selectedUser) {
            toast.error("Please select a user to start a video call");
            return;
        }
        
        // Create call ID from both user IDs (sorted for consistency)
        const videoCallId = [authUser._id.toString(), selectedUser._id.toString()]
            .sort()
            .join("-video");
        
        // Navigate to video call route
        navigate(`/video-call/${videoCallId}`);
    };

    // Check if user is selected
    if (!selectedUser) {
        return (
            <div className="flex items-center justify-center h-full bg-white">
                <div className="text-center">
                    <p className="text-gray-600 text-sm">Select a user to start chatting</p>
                    <p className="text-gray-400 text-xs mt-2">Choose someone from the sidebar</p>
                </div>
            </div>
        );
    }

    // Loading state
    const isLoading = isConnecting || !client || !channel || !client?.userID;
    
    if (isLoading) {
        let loadingMessage = "Connecting to chat...";
        if (!client) loadingMessage = "Initializing client...";
        else if (!client?.userID) loadingMessage = "Connecting user...";
        else if (!channel) loadingMessage = "Setting up channel...";
        else if (isConnecting) loadingMessage = "Connecting to Stream...";
        
        return (
            <div className="flex items-center justify-center h-full bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-sm">{loadingMessage}</p>
                    <p className="text-gray-400 text-xs mt-2">
                        {!client && "Waiting for client..."}
                        {client && !client.userID && "Waiting for user connection..."}
                        {client?.userID && !selectedUser && "Waiting for user selection..."}
                        {client?.userID && selectedUser && !channel && "Setting up channel..."}
                    </p>
                </div>
            </div>
        );
    }

    // Custom theme to match your dark minimalist design
    const customTheme = {
        '--bg-gradient-end': '#0f172a',
        '--bg-gradient-start': '#1e293b',
        '--bg-primary': '#1e293b',
        '--bg-secondary': '#0f172a',
        '--border-color': 'rgba(148, 163, 184, 0.3)',
        '--color-primary': '#06b6d4',
        '--color-secondary': '#3b82f6',
        '--text-high-emphasis': '#f1f5f9',
        '--text-low-emphasis': '#94a3b8',
        '--message-bubble-color': '#334155',
        '--message-bubble-color-own': 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
        '--message-text-color': '#f1f5f9',
        '--message-text-color-own': '#ffffff',
    };

    // Using Stream Chat React UI Components with custom white theme
    return (
        <div className="h-full w-full bg-white overflow-hidden">
            <style>
                {`
                    /* Override Stream Chat styles to match white theme */
                    .str-chat {
                        background: #ffffff !important;
                        color: #111827 !important;
                        height: 100% !important;
                        display: flex !important;
                        flex-direction: column !important;
                    }
                    
                    .str-chat__channel-header {
                        background: #ffffff !important;
                        border-bottom: 1px solid #e5e7eb !important;
                        padding: 1rem !important;
                    }
                    
                    .str-chat__channel-header-title {
                        color: #111827 !important;
                        font-weight: 600 !important;
                    }
                    
                    .str-chat__channel-header-subtitle {
                        color: #6b7280 !important;
                    }
                    
                    .str-chat__message-list {
                        background: #ffffff !important;
                        flex: 1 !important;
                        overflow-y: auto !important;
                        padding: 1rem !important;
                    }
                    
                    .str-chat__message {
                        background: transparent !important;
                        margin-bottom: 0.75rem !important;
                    }
                    
                    .str-chat__message-simple {
                        display: flex !important;
                        align-items: flex-end !important;
                    }
                    
                    .str-chat__message-simple--me {
                        justify-content: flex-end !important;
                    }
                    
                    .str-chat__message-simple__text {
                        color: #111827 !important;
                        font-size: 0.875rem !important;
                    }
                    
                    .str-chat__message-simple--me .str-chat__message-simple__text {
                        color: #ffffff !important;
                    }
                    
                    .str-chat__message-simple__bubble {
                        background: #f3f4f6 !important;
                        border-radius: 0.75rem !important;
                        padding: 0.75rem 1rem !important;
                        max-width: 70% !important;
                        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
                        border: 1px solid #e5e7eb !important;
                    }
                    
                    .str-chat__message-simple--me .str-chat__message-simple__bubble {
                        background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%) !important;
                        color: #ffffff !important;
                        border: none !important;
                    }
                    
                    .str-chat__input {
                        background: #ffffff !important;
                        border-top: 1px solid #e5e7eb !important;
                        padding: 1rem !important;
                    }
                    
                    .str-chat__input-flat {
                        background: #f9fafb !important;
                        border: 1px solid #e5e7eb !important;
                        border-radius: 0.5rem !important;
                        color: #111827 !important;
                        padding: 0.75rem 1rem !important;
                        font-size: 0.875rem !important;
                    }
                    
                    .str-chat__input-flat:focus {
                        border-color: #06b6d4 !important;
                        outline: none !important;
                        box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.1) !important;
                        background: #ffffff !important;
                    }
                    
                    .str-chat__input-flat::placeholder {
                        color: #9ca3af !important;
                    }
                    
                    .str-chat__send-button {
                        background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%) !important;
                        border-radius: 0.5rem !important;
                        padding: 0.5rem 1rem !important;
                        transition: opacity 0.2s !important;
                    }
                    
                    .str-chat__send-button:hover {
                        opacity: 0.9 !important;
                    }
                    
                    .str-chat__send-button:disabled {
                        opacity: 0.5 !important;
                        cursor: not-allowed !important;
                    }
                    
                    .str-chat__message-attachment {
                        border-radius: 0.75rem !important;
                        overflow: hidden !important;
                        margin-top: 0.5rem !important;
                    }
                    
                    .str-chat__message-attachment-img {
                        border-radius: 0.75rem !important;
                        max-width: 100% !important;
                    }
                    
                    /* Scrollbar styling */
                    .str-chat__message-list-scroll,
                    .str-chat__message-list {
                        scrollbar-width: thin;
                        scrollbar-color: #d1d5db transparent;
                    }
                    
                    .str-chat__message-list-scroll::-webkit-scrollbar,
                    .str-chat__message-list::-webkit-scrollbar {
                        width: 6px;
                    }
                    
                    .str-chat__message-list-scroll::-webkit-scrollbar-track,
                    .str-chat__message-list::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    
                    .str-chat__message-list-scroll::-webkit-scrollbar-thumb,
                    .str-chat__message-list::-webkit-scrollbar-thumb {
                        background: #d1d5db;
                        border-radius: 3px;
                    }
                    
                    .str-chat__message-list-scroll::-webkit-scrollbar-thumb:hover,
                    .str-chat__message-list::-webkit-scrollbar-thumb:hover {
                        background: #9ca3af;
                    }
                    
                    /* Avatar styling */
                    .str-chat__avatar {
                        border-radius: 50% !important;
                    }
                    
                    .str-chat__avatar-image {
                        border-radius: 50% !important;
                    }
                    
                    /* Thread styling */
                    .str-chat__thread {
                        background: #f9fafb !important;
                        border-left: 1px solid #e5e7eb !important;
                    }
                    
                    /* Loading states */
                    .str-chat__loading-indicator {
                        color: #06b6d4 !important;
                    }
                    
                    /* Date separators */
                    .str-chat__date-separator {
                        color: #6b7280 !important;
                    }
                    
                    /* Message reactions */
                    .str-chat__message-reactions-list {
                        background: #f9fafb !important;
                        border: 1px solid #e5e7eb !important;
                    }
                `}
            </style>
            <Chat client={client} theme="messaging light">
                <Channel channel={channel}>
                    <Window>
                        <div className="relative">
                            <div className="absolute top-2 right-2 z-10">
                                <button
                                    onClick={handleStartVideoCall}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg text-sm"
                                    title="Start video call"
                                >
                                    <Video className="w-4 h-4" />
                                    <span className="font-medium">Video</span>
                                </button>
                            </div>
                            <ChannelHeader />
                        </div>
                        <MessageList />
                        <MessageInput />
                    </Window>
                    <Thread />
                </Channel>
            </Chat>
    </div>
    );
}

export default StreamChatPage
