import axios from "axios"

// Use localhost for development, production URL for production
const getBaseURL = () => {
    // If VITE_API_URL is explicitly set, use it
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    // Check if we're in development mode
    const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
    
    // Check if we're on localhost
    const isLocalhost = typeof window !== 'undefined' && 
                       (window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1');
    
    // Always prefer localhost if we're in dev mode OR on localhost
    if (isDev || isLocalhost) {
        return "http://localhost:3000";
    }
    
    // In production, use production backend
    return "https://whisppp-backend.onrender.com";
};

// Create axios instance with dynamic baseURL
export const axiosInstance = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true
});