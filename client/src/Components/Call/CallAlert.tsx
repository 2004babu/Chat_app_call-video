import React from "react";
import { useCall } from "./Call";
import { useNavigate } from "react-router-dom";
import AdvancedFloatingBox from "../utils/AdvancedFloatingBox";



const CallAlert: React.FC = () => {
    const { declineCall, callAccepted, answerCall, call } = useCall()!;
    const navigate = useNavigate()


    const acceptCall = () => {

        answerCall()
        navigate('/call')

    };

    // const declineCall = () => {
    //     endCall()
    //     console.log('decline call');

    // };

    if (!call) return null;

    // console.log(call);

    return (
        <>
            {!callAccepted && <AdvancedFloatingBox >
                <h3 className="text-lg font-bold  ">{call.name} ..is calling... </h3>
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
            </AdvancedFloatingBox>}
            {/* {!callAccepted&&<div className="fixed top-5 right-5 bg-white shadow-lg p-4 rounded-lg flex flex-col items-center w-100">
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
            </div>} */}
        </>

    );
};

export default CallAlert;
