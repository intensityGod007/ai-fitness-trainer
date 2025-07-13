"use client";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { vapi } from '@/lib/vapi';



const GenerateProgramPage = () => {
  const [callActive, setcallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [callEnded, setCallEnded] = useState(false);

  const { user } = useUser()
  const router = useRouter();

  const messageContainerRef = useRef<HTMLDivElement>(null);

  // auto-scroll messages
  useEffect(() => {
    if(messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // navigate user to profile page after the call ends
  useEffect(() => {
    if(callEnded) {
      const redirectTimer = setTimeout(() => {
        router.push("/profile");
      }, 2000);
    }
  }, [callEnded]);

  // setup event listners for vapi
  useEffect(() => {
    const handleCallStart = () => {
      console.log("Call started");
      setConnecting(false);
      setcallActive(true);
      setCallEnded(false);
    }
    const handleCallEnd = () => {
      console.log("Call ended");
      setcallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);
    }
    const handleSpeechStart = () => {
      console.log("Speech started");
      setIsSpeaking(true);
    }
    const handleSpeechEnd = () => {
      console.log("Speech ended");
      setIsSpeaking(false);
    }
    const handleMessage = (message: any) => {}
    const handleError = (error: any) => {
      console.log("Vapi error:", error);
      setConnecting(false);
      setcallActive(false);
    }

    vapi.on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError)

    // clean up event listners on unmount
    return () => {
      vapi.off("call-start", handleCallStart)
          .off("call-end", handleCallEnd)
          .off("speech-start", handleSpeechStart)
          .off("speech-end", handleSpeechEnd)
          .off("message", handleMessage)
          .off("error", handleError)
    }
  }, []);

  const toggleCall = () => {
    if (callActive) vapi.stop();
    else {
      try {
        setConnecting(true);
        setMessages([]);
        setCallEnded(false);

        const fullName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName || ""}` : user?.username || "User";
        
        vapi.start(process.env.NEXT_PUBLIC_VAPI_API_KEY!, {
          variableValues: {
            full_name: fullName,
            // TODO: send user_id as well later
          }
      });
      } catch (error) {
        console.log("Failed to start call:", error);
        setConnecting(false);
      }
    }
  }

  return (
    <div>GenerateProgramPage</div>
  )
}

export default GenerateProgramPage;