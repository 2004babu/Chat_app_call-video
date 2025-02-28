import React, { useEffect } from "react";
import { useSocketContext } from "../Context/SocketContext";
import { useCall } from "./Call";
import { useNavigate } from "react-router-dom";



const CallAlert: React.FC = () => {
    const { myVideo, userVideo, callAccepted,endCall, answerCall,call } = useCall()!;
    const navigate = useNavigate()
    const { socket } = useSocketContext()!;

    useEffect(() => {
      
    }, [socket,call]);

    const acceptCall = () => {
       
        answerCall()
        navigate('/call')

    };

    const declineCall = () => {
        endCall()
        console.log('decline call');

    };

    if (!call) return null;

    return (
        <>
            {!callAccepted&&<div className="fixed top-5 right-5 bg-white shadow-lg p-4 rounded-lg flex flex-col items-center w-100">
            <div className="flex flex-col items-center">
                <div className="grid grid-cols-2 gap-4">
                    <video ref={myVideo} autoPlay playsInline className="w-64 h-48 border rounded-lg" />
                    {callAccepted && <video ref={userVideo} autoPlay playsInline className="w-64 h-48 border rounded-lg" />}
                </div>
                </div>
                <h3 className="text-lg font-bold">{call.name} is calling...</h3>
                <div className="flex gap-4 mt-4">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={acceptCall}
                    >
                        Accept
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={declineCall}
                    >
                        Decline
                    </button>
                </div>
            </div>}
        </>

    );
};

export default CallAlert;
