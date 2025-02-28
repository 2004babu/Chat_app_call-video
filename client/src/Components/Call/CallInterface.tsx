import { useNavigate } from "react-router-dom";
import { useCall } from "./Call";


const CallInterface = () => {
    const { myVideo, userVideo, call, callAccepted, endCall, answerCall } = useCall()!;
const navigate=useNavigate()
  

    return (
      <div className="flex flex-col items-center w-screen h-screen ">
        <div className="flex flex-col items-center  w-full h-90">
          <video ref={myVideo} autoPlay playsInline className="w-full h-full  rounded-lg" />
          {callAccepted && <video ref={userVideo} autoPlay playsInline className="w-full h-full  rounded-lg" />}
    </div>
  
        {!callAccepted && call?.isReceivingCall && (
          <button onClick={answerCall} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">Answer</button>
        )}
  
        {/* <input type="text" id="callId" placeholder="Enter ID" className="mt-4 p-2 border" /> */}
       {callAccepted&& <button onClick={() => {
          endCall()
          navigate('/')
          }} className="z-10 px-4 py-2 bg-blue-500 text-white rounded">

          End Call
        </button>}
      </div>
    );
}

export default CallInterface


// import { useCall } from "./CallContext";

// const Call = () => {
  
// };

// export default VideoCall;
