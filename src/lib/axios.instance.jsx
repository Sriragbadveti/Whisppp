import axios from "axios"

// Use localhost for development, production URL for production
const getBaseURL = () => {
    // If VITE_API_URL is explicitly set, use it
    if (import.meta.env.VITE_API_URL) {
        console.log("🌐 Using VITE_API_URL:", import.meta.env.VITE_API_URL);
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
        const localURL = "http://localhost:3000";
        console.log("🔧 Development mode detected, using localhost:", localURL);
        console.log("   - isDev:", isDev);
        console.log("   - isLocalhost:", isLocalhost);
        console.log("   - hostname:", typeof window !== 'undefined' ? window.location.hostname : 'N/A');
        return localURL;
    }
    
    // In production, use production backend
    const prodURL = "https://whisppp-backend.onrender.com";
    console.log("🚀 Production mode, using:", prodURL);
    return prodURL;
};

// Create axios instance with dynamic baseURL
export const axiosInstance = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true
});

// Log the base URL being used
console.log("📡 Axios baseURL:", axiosInstance.defaults.baseURL);