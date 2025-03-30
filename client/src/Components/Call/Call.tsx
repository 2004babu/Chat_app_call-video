import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/Store";
import { useSocketContext } from "../Context/SocketContext";
// import { useNavigate } from "react-router-dom";

interface CallContextProps {
  myStream: MediaStream | null;
  call: any;
  callAccepted: boolean;
  myVideo: React.RefObject<HTMLVideoElement>;
  userVideo: React.RefObject<HTMLVideoElement>;
  callUser: (id: string) => void;
  answerCall: () => void;
  endCall: () => void;
  declineCall?: () => void;
  setCall: React.Dispatch<any>;
}

const CallContext = createContext<CallContextProps | undefined>(undefined);

export const Call: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [call, setCall] = useState<any>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);

  // const navigate = useNavigate()

  const { user, ChatUser } = useSelector((state: RootState) => state.user);
  const { socket } = useSocketContext()!;

  useEffect(() => {
    if (!socket) return;

    socket?.on("callIncoming", ({ from, signal,name }) => {
      setCall({ isReceivingCall: true, from, signal, name });
    });

    return () => {
      socket?.off("callIncoming");
    };
  }, [socket]);

  const SetMyStreamEmpty = async () => {
    console.log(myStream);

    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
      setMyStream(null);
    }
  }
  useEffect(() => {
    if (!socket) return;


    socket?.on("endedCall", async () => {
      // setCall({ isReceivingCall: true, from, signal });
      console.log("Ending call...");
      connectionRef.current?.destroy();
      connectionRef.current = null;
      setCall(null);
      setCallAccepted(false);
      SetMyStreamEmpty()

      window.location.reload()
      if (userVideo.current) userVideo.current.srcObject = null;

    });


    return () => {
      socket?.off("endedCall");
    };
  }, [socket]);


  useEffect(() => {
    if (!socket) return;


    socket?.on("declineCall", async () => {
      console.log("declineCall...", myStream);

      // Destroy Peer Connection
      // connectionRef.current?.destroy();
      // connectionRef.current = null;
      // setCall(null);
      // setCallAccepted(false);

      //   // Stop and clear media stream

      // if (myStream) {
      //   myStream.getTracks().forEach((track) => track.stop());
      //   setMyStream(null);
      // }    

      // Remove video from UI
      // if (userVideo.current) {
      //   userVideo.current.srcObject = null;
      // }

      // Fully disable camera & mic

      window?.location?.reload()


    });



    return () => {
      socket?.off("declineCall");
    };
  }, [socket]);

  const getUserMedia = async () => {
    if (!myStream) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMyStream(stream);
        if (myVideo.current) myVideo.current.srcObject = stream;
        return stream;
      } catch (error) {
        console.error("Error accessing media devices:", error);
        return null;
      }
    }
    return myStream;
  };

  const callUser = async (id: string) => {
    console.log("Initiating call...");

    const stream = await getUserMedia();
    if (!stream) return;

    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (signal) => {
      console.log(user);
      
      socket?.emit("callUser", { userToCall: id, signalData: signal, from: socket.id, name: user?.userName ?? user?.email });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    socket?.once("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = async () => {
    console.log("Answering call...");
    setCallAccepted(true);

    const stream = await getUserMedia();
    if (!stream) return;

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (signal) => {
      socket?.emit("answerCall", { signal, to: call.from });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  // console.log(call);

  const endCall = () => {
    console.log(socket, ChatUser?.uid);

    if (socket && ChatUser?.uid) {
      console.log('emiter');

      socket?.emit('endedCall', {
        to: ChatUser.uid
      })
    }
    if (socket && call?.from) {
      console.log('emiter');

      socket?.emit('endedCall', { to: call.from })
    }
    console.log("Ending call...");
    connectionRef.current?.destroy();
    connectionRef.current = null;
    setCall(null);
    setCallAccepted(false);
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
      setMyStream(null);
    }
    if (userVideo.current) userVideo.current.srcObject = null;
    window.location.reload()

  };

  const declineCall = () => {
    console.log('decline call');

    if (socket && ChatUser?.uid) {
      console.log('declineCall');

      socket?.emit('declineCall', {
        to: ChatUser.uid
      })
    }
    if (socket && call?.from) {
      console.log('emiter');

      socket?.emit('declineCall', { to: call.from })
    }
    console.log("Ending call...");
    connectionRef.current?.destroy();
    connectionRef.current = null;
    setCall(null);
    setCallAccepted(false);
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
      // setMyStream(null);
    }
    if (userVideo.current) userVideo.current.srcObject = null;
    // window.location.reload()

  };
  return (
    <CallContext.Provider value={{ setCall, myStream, call, callAccepted, myVideo, userVideo, callUser, answerCall, endCall, declineCall }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
