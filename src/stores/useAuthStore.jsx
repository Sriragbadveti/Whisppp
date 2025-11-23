import { create } from "zustand";
import { axiosInstance } from "../lib/axios.instance";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL = import.meta.env.VITE_API_URL || "https://whisppp-backend.onrender.com";
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
      console.log(error);
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
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
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
