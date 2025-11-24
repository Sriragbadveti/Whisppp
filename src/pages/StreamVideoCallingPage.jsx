import React, { useEffect, useState } from 'react';
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useAuthStore } from '../stores/useAuthStore';
import { useChatStore } from '../stores/useChatStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function StreamVideoCallingPage({ callId, onLeave }) {
  const { authUser } = useAuthStore();
  const { streamToken } = useChatStore();
  const [videoClient, setVideoClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    if (!authUser || !streamToken || !callId) {
      setIsConnecting(false);
      return;
    }

    let callInstance = null;
    let clientInstance = null;

    const initializeCall = async () => {
      try {
        setIsConnecting(true);

        const user = {
          id: authUser._id.toString(),
          name: authUser.username || 'User',
          image: authUser.profilePic || undefined,
        };

        const videoClient = new StreamVideoClient({
          apiKey: import.meta.env.VITE_STREAM_API_KEY,
          user,
          token: streamToken,
        });

        const callInstance = videoClient.call('default', callId);
        await callInstance.join({ create: true });

        setVideoClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        toast.error('Could not join the call. Please try again.');
        if (onLeave) onLeave();
      } finally {
        setIsConnecting(false);
      }
    };

    initializeCall();

    // Cleanup on unmount
    return () => {
      if (callInstance) {
        callInstance.leave().catch(() => {});
      }
      if (clientInstance) {
        clientInstance.disconnectUser().catch(() => {});
      }
    };
  }, [authUser, streamToken, callId, onLeave]);

  if (isConnecting) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Joining video call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative w-full h-full">
        {videoClient && call ? (
          <StreamVideo client={videoClient}>
            <StreamCall call={call}>
              <CallContent onLeave={onLeave} />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const CallContent = ({ onLeave }) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) {
    if (onLeave) {
      onLeave();
    } else {
      navigate('/');
    }
    return null;
  }

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls onLeave={onLeave} />
    </StreamTheme>
  );
}

export default StreamVideoCallingPage;
