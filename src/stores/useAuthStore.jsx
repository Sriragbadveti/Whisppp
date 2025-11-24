import { create } from "zustand";
import { axiosInstance } from "../lib/axios.instance";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
// Use localhost for development, production URL for production
const getBaseURL = () => {
    // If VITE_API_URL is explicitly set, use it
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    // Check if we're in development mode or on localhost
    const isLocalhost = typeof window !== 'undefined' && 
                       (window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' ||
                        window.location.hostname === '');
    
    const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
    
    if (isDev || isLocalhost) {
        return "http://localhost:3000";
    }
    
    // In production, use production backend
    return "https://whisppp-backend.onrender.com";
};

const BASE_URL = getBaseURL();
import { StreamChat } from "stream-chat";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isChecking: true,

  isSignedUp: false,

  isLoggedIn: false,
  onlineUsers: [],
  socket: null,

  checkUser: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isChecking: false });
    }
  },

  signup: async (formData) => {
    set({ isSignedUp: true });
    try {
      const res = await axiosInstance.post("/auth/sign-up", formData);
      toast.success("Account created successfully");
      // Refresh auth state to trigger navigation
      await get().checkUser();
      get().connectSocket();
    
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isSignedUp: false });
    }
  },

  login: async (formData) => {
    set({ isLoggedIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      toast.success("Account logged in successfully");
      // Refresh auth state to trigger navigation
      await get().checkUser();
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isLoggedIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      toast.success("User has been successfully logged out");
      get().disconnectSocket();
      set({ authUser: null, socket: null, onlineUsers: [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to logout");
      // Still disconnect and clear state even if API call fails
      get().disconnectSocket();
      set({ authUser: null, socket: null, onlineUsers: [] });
    }
  },

  updateProfile: async (profilePic) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", {
        profilePic,
      });
      set({ authUser: res.data });
      toast.success("Profile picture updated successfullyy");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile picture"
      );
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    
    // Don't connect if no user or already connected
    if (!authUser || (socket && socket.connected)) {
      return;
    }

    // Disconnect existing socket if any
    if (socket) {
      socket.disconnect();
    }

    const newSocket = io(BASE_URL, { 
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    newSocket.on("connect", () => {
      // Socket connected
    });

    newSocket.on("connect_error", () => {
      // Socket connection error
    });

    newSocket.on("disconnect", () => {
      // Socket disconnected
    });

    newSocket.on("getAllOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket && socket.connected) {
      socket.disconnect();
      set({ socket: null });
    }
  },


  
}));
