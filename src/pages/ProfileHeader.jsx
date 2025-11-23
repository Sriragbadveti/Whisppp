import React, { useRef, useState } from 'react'
import { Volume2, VolumeX, LogOut, Camera } from 'lucide-react'
import { useAuthStore } from "../stores/useAuthStore"

function ProfileHeader() {
  const { authUser, updateProfile, socket, logout } = useAuthStore();
  const isOnline = socket && socket.connected;
  
  // File input ref for image upload
  const fileInputRef = useRef(null);
  
  // Sound state and audio ref
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const audioRef = useRef(null);
  
  // Image preview state
  const [selectedImg, setSelectedImg] = useState(null);
  
  // Function to trigger file input click
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  // Function to toggle sound and play click sound
  const handleSoundToggle = () => {
    // Toggle sound state
    setIsSoundEnabled(!isSoundEnabled);
    
    // Always play click sound when button is clicked
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset to start
      audioRef.current.play().catch(err => console.log("Sound play error:", err));
    }
  };

  const handleImageUpload = (e)=>{
    const file = e.target.files[0];
    if(!file) return
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64image = reader.result;
      setSelectedImg(base64image);
      await updateProfile(base64image);
    }
  }

  return (
    <div className="p-4 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        {/* User Info */}
        <div className="flex items-center gap-3">
          {/* User Image Circle - Clickable File Input */}
          <div className="relative">
            <button
              onClick={handleImageClick}
              className="relative w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 hover:from-cyan-400 hover:to-blue-400 transition-all duration-200 group cursor-pointer"
            >
              <div className="w-full h-full rounded-full bg-slate-800 overflow-hidden">
                <img 
                  src={selectedImg || authUser?.profilePic || "/avatar.png"} 
                  alt="User avatar" 
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-200"
                />
              </div>
              {/* Hover Overlay with Camera Icon */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 rounded-full">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </button>
            {/* Online Status Indicator */}
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-800 z-10"></div>
            )}
            
            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          
          {/* User Name */}
          <div>
            <h3 className="text-white font-semibold text-sm">{authUser?.username || "Username"}</h3>
            <p className="text-slate-400 text-xs">{isOnline ? "Online" : "Offline"}</p>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          {/* Sound Button */}
          <button 
            onClick={handleSoundToggle}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors duration-200 group"
          >
            {isSoundEnabled ? (
              <Volume2 className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors duration-200" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors duration-200" />
            )}
          </button>
          
          {/* Hidden Audio Element */}
          <audio ref={audioRef} src="/mouse-click.mp3" preload="auto" />
          
          {/* Logout Button */}
          <button 
            onClick={logout}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors duration-200 group"
          >
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors duration-200" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
