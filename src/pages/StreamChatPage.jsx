import React, { useEffect, useState } from 'react'
import { StreamChat } from "stream-chat";
import { Chat, Channel, Window, ChannelHeader, MessageList, MessageInput, Thread } from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import { useAuthStore } from '../stores/useAuthStore';
import { useChatStore } from '../stores/useChatStore';
import toast from 'react-hot-toast';

function StreamChatPage() {
    const { authUser } = useAuthStore();
    const { selectedUser, getStreamToken, streamToken } = useChatStore();
    
    const [client, setClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);

    // Initialize Stream Chat client
    useEffect(() => {
        if (!authUser || !import.meta.env.VITE_STREAM_API_KEY) {
            console.error("Missing authUser or STREAM_API_KEY");
            return;
        }

        const streamClient = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
        setClient(streamClient);

        return () => {
            // Cleanup: disconnect user when component unmounts
            if (streamClient) {
                streamClient.disconnectUser().catch(console.error);
            }
        };
    }, [authUser]);

    // Retrieve stream token when component mounts or authUser changes
    useEffect(() => {
        if (authUser && !streamToken) {
            getStreamToken().catch((error) => {
                console.error("Failed to retrieve stream token:", error);
            });
        }
    }, [authUser, streamToken, getStreamToken]);

    // Connect user to Stream and retrieve token
    useEffect(() => {
        if (!client || !authUser || !streamToken) return;

        const connectUser = async () => {
            try {
                setIsConnecting(true);

                // Connect user with token
                await client.connectUser(
                    {
                        id: authUser._id.toString(),
                        name: authUser.username || 'User',
                        image: authUser.profilePic || undefined,
                    },
                    streamToken
                );

                setIsConnecting(false);
            } catch (error) {
                console.error("Error connecting to Stream:", error);
                toast.error("Failed to connect to chat");
                setIsConnecting(false);
            }
        };

        connectUser();
    }, [client, authUser, streamToken]);

    // Create and watch channel when user is selected
    useEffect(() => {
        if (!client || !authUser || !selectedUser || !streamToken || isConnecting) {
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
                console.error("Error setting up channel:", error);
                toast.error("Failed to load chat");
                return null;
            }
        };

        let isCancelled = false;
        setupChannel().then((newChannel) => {
            if (!isCancelled && newChannel) {
                setChannel(newChannel);
            }
        });

        // Cleanup: stop watching channel when selectedUser changes
        return () => {
            isCancelled = true;
            setChannel(null);
        };
    }, [client, authUser, selectedUser, streamToken, isConnecting]);

    // Loading state
    if (isConnecting || !client || !channel) {
        return (
            <div className="flex items-center justify-center h-full bg-slate-900/50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-slate-400 text-sm">Connecting to chat...</p>
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

    // Using Stream Chat React UI Components with custom dark theme
    return (
        <div className="h-full bg-slate-900/50">
            <style>
                {`
                    /* Override Stream Chat styles to match your dark theme */
                    .str-chat {
                        background: transparent !important;
                        color: var(--text-high-emphasis) !important;
                    }
                    
                    .str-chat__channel-header {
                        background: rgba(30, 41, 59, 0.5) !important;
                        backdrop-filter: blur(8px);
                        border-bottom: 1px solid rgba(148, 163, 184, 0.3) !important;
                    }
                    
                    .str-chat__channel-header-title {
                        color: #f1f5f9 !important;
                    }
                    
                    .str-chat__channel-header-subtitle {
                        color: #94a3b8 !important;
                    }
                    
                    .str-chat__message-list {
                        background: transparent !important;
                    }
                    
                    .str-chat__message {
                        background: transparent !important;
                    }
                    
                    .str-chat__message-simple__text {
                        color: #f1f5f9 !important;
                    }
                    
                    .str-chat__message-simple--me .str-chat__message-simple__text {
                        color: #ffffff !important;
                    }
                    
                    .str-chat__message-simple__bubble {
                        background: #334155 !important;
                        border-radius: 0.5rem !important;
                    }
                    
                    .str-chat__message-simple--me .str-chat__message-simple__bubble {
                        background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%) !important;
                        color: #ffffff !important;
                    }
                    
                    .str-chat__input {
                        background: rgba(30, 41, 59, 0.5) !important;
                        backdrop-filter: blur(8px);
                        border-top: 1px solid rgba(148, 163, 184, 0.3) !important;
                    }
                    
                    .str-chat__input-flat {
                        background: rgba(51, 65, 85, 0.5) !important;
                        border: 1px solid rgba(148, 163, 184, 0.3) !important;
                        border-radius: 0.5rem !important;
                        color: #f1f5f9 !important;
                    }
                    
                    .str-chat__input-flat:focus {
                        border-color: rgba(6, 182, 212, 0.5) !important;
                        outline: none !important;
                        box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2) !important;
                    }
                    
                    .str-chat__input-flat::placeholder {
                        color: #64748b !important;
                    }
                    
                    .str-chat__send-button {
                        background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%) !important;
                        border-radius: 0.5rem !important;
                    }
                    
                    .str-chat__send-button:hover {
                        opacity: 0.9 !important;
                    }
                    
                    .str-chat__send-button:disabled {
                        opacity: 0.5 !important;
                    }
                    
                    .str-chat__message-attachment {
                        border-radius: 0.5rem !important;
                    }
                    
                    .str-chat__message-attachment-img {
                        border-radius: 0.5rem !important;
                    }
                    
                    /* Scrollbar styling */
                    .str-chat__message-list-scroll {
                        scrollbar-width: thin;
                        scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
                    }
                    
                    .str-chat__message-list-scroll::-webkit-scrollbar {
                        width: 6px;
                    }
                    
                    .str-chat__message-list-scroll::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    
                    .str-chat__message-list-scroll::-webkit-scrollbar-thumb {
                        background: rgba(148, 163, 184, 0.3);
                        border-radius: 3px;
                    }
                    
                    .str-chat__message-list-scroll::-webkit-scrollbar-thumb:hover {
                        background: rgba(148, 163, 184, 0.5);
                    }
                `}
            </style>
            <Chat client={client} theme="messaging dark">
                <Channel channel={channel}>
                    <Window>
                        <ChannelHeader />
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
