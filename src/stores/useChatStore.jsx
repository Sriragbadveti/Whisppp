import { create } from "zustand";
import { axiosInstance } from "../lib/axios.instance";
import toast from "react-hot-toast";
export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isChatsLoading: false,
  messageHandler: null,
  streamToken:null,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  toggleTab: (tab) => {
    set({ activeTab: tab });
  },

  toggleUser: (user) => {
    set({ selectedUser: user });
  },

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/api/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });

    try {
      // Try Stream Chat channels first, fallback to MongoDB chats
      const res = await axiosInstance.get("/chat/chats").catch(() => {
        // Fallback to MongoDB chats if Stream Chat fails
        return axiosInstance.get("/api/chats");
      });
      set({ chats: res.data });
    } catch (error) {
      // If both fail, try MongoDB as last resort
      try {
        const fallbackRes = await axiosInstance.get("/api/chats");
        set({ chats: fallbackRes.data });
      } catch (fallbackError) {
        toast.error("Failed to load chats");
        set({ chats: [] });
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isChatsLoading: true });
    try {
      const res = await axiosInstance.get(`/api/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isChatsLoading: false });
    }
  },

  sendMessage: async (messageData, authUser) => {
    const {selectedUser, messages} = get();
    
    if (!selectedUser || !authUser) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString()
    }

    // Add optimistic message immediately
    set({messages: [...messages, optimisticMessage]});
    
    try {
      const res = await axiosInstance.post(`/api/send/${selectedUser._id}`, messageData);
      // Replace optimistic message with real message from server
      const updatedMessages = messages.filter(msg => msg._id !== tempId);
      set({messages: [...updatedMessages, res.data.newMessage]});
    } catch (error) {
      // Remove optimistic message on error
      const updatedMessages = messages.filter(msg => msg._id !== tempId);
      set({messages: updatedMessages});
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeMessages: (socket, selectedUser, authUser) => {
    if (!socket || !selectedUser || !authUser) return;

    // Remove existing handler if any
    const existingHandler = get().messageHandler;
    if (existingHandler) {
      socket.off("newMessage", existingHandler);
    }

    const messageHandler = (newMessage) => {
      // Only add message if it's from the selected user or to the selected user
      const isMessageForThisChat = 
        (newMessage.senderId.toString() === selectedUser._id.toString() && 
         newMessage.receiverId.toString() === authUser._id.toString()) ||
        (newMessage.senderId.toString() === authUser._id.toString() && 
         newMessage.receiverId.toString() === selectedUser._id.toString());

      if (!isMessageForThisChat) return;

      const previousMessages = get().messages;
      // Check if message already exists to avoid duplicates
      const messageExists = previousMessages.some(msg => msg._id?.toString() === newMessage._id?.toString());
      if (messageExists) return;

      set({ messages: [...previousMessages, newMessage] });

      // Play keystroke sound if audio is enabled and message has text and is from other user
      // Read sound setting from localStorage
      const isSoundEnabled = JSON.parse(localStorage.getItem("isSoundEnabled") || "true");
      if (isSoundEnabled && newMessage.text && newMessage.senderId.toString() !== authUser._id.toString()) {
        const keystrokeSounds = [
          "/keystroke1.mp3",
          "/keystroke2.mp3",
          "/keystroke3.mp3",
          "/keystroke4.mp3"
        ];
        const randomSound = keystrokeSounds[Math.floor(Math.random() * keystrokeSounds.length)];
        const audio = new Audio(randomSound);
        
        audio.addEventListener('ended', () => {
          audio.currentTime = 0;
        }, { once: true });
        
        audio.play().catch(err => console.log("Sound play error:", err));
      }
    };

    socket.on("newMessage", messageHandler);
    
    // Store handler reference for cleanup
    set({ messageHandler });
  },

  unsubscribeMessages: (socket) => {
    if (!socket) return;
    const handler = get().messageHandler;
    if (handler) {
      socket.off("newMessage", handler);
      set({ messageHandler: null });
    }
  },

  getStreamToken:async()=>{
    try {
      const response = await axiosInstance.get("/chat/stream-token");
      if (response.data && response.data.streamToken) {
        set({streamToken: response.data.streamToken});
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error getting stream token:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to get stream token";
      toast.error(errorMessage);
      set({streamToken: null});
    }
    
  }
}));
