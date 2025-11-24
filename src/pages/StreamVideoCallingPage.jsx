import React from 'react'
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
function StreamVideoCallingPage() {
  const { authUser } = useAuthStore();
    const { selectedUser, getStreamToken, streamToken } = useChatStore();
    
    useEffect(() => {
      const client = new StreamVideoClient(import.meta.env.VITE_STREAM_API_KEY , authUser , streamToken)
    
      
    }, [third])
    

  return (
    <div>
      
    </div>
  )
}

export default StreamVideoCallingPage
