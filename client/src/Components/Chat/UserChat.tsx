import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setChatUser, setUser } from '../../Redux/Slices/UserSlice'
import { RootState } from '../../Redux/Store'
import { useNavigate, useParams } from 'react-router-dom'
import { setConversation } from '../../Redux/Slices/messageSlice'

import { useCall } from '../Call/Call'
import { useSocketContext } from '../Context/SocketContext'


const UserChat = () => {
    const { id: userChatId } = useParams()
if (!userChatId) {
    return null
}


    // const [isFriend, setIsFriend] = useState<boolean>(false)
    const [isOnlineUser, setIsOnlineUser] = useState<boolean>(false)
    const dispatch = useDispatch()
    const [isLoaded, setisLoaded] = useState<boolean>(false)
    const [ChatSendisLoaded, setChatSendisLoaded] = useState<boolean>(false)
    const [chatText, setChatText] = useState<string>('')

    const { ChatUser, user } = useSelector((state: RootState) => state.user)
    const { conversation } = useSelector((state: RootState) => state.conversation)


    const navigate = useNavigate()
    const wholeChatRefEle = useRef<HTMLDivElement>(null)

    const { callUser } = useCall()!;
    const { socket, onlineUsers } = useSocketContext()!



    const getSingleUser = async () => {
        try {
            setisLoaded(false)

            const apiURL = import.meta.env.VITE_BACKEND_URL
            const response = await axios.get(apiURL + "/auth/user?id=" + userChatId, { withCredentials: true })

            if (response.data.user) {

                dispatch(setChatUser(response.data))
            }

        } catch (error) {
            console.log(error);

        } finally {
            setisLoaded(true)
        }
    }


    const loadUser = async () => {
        try {
            setisLoaded(false)

            const apiURL = import.meta.env.VITE_BACKEND_URL
            const response = await axios.get(apiURL + "/auth/loadUser", { withCredentials: true })

            if (response.data.user) {

                dispatch(setUser(response.data))
            }

        } catch (error) {
            console.log(error);

        } finally {
            setisLoaded(true)
        }
    }
    const getConversation = async () => {
        try {

            const apiURL = import.meta.env.VITE_BACKEND_URL
            const response = await axios.get(apiURL + "/message/conversation?id=" + userChatId, { withCredentials: true })

            if (response.data.conversation) {

                dispatch(setConversation(response.data))
            }

        } catch (error) {
            console.log(error);

        } finally {
        }
    }
    useEffect(() => {
        getConversation()
        loadUser()
        getSingleUser()      
        console.log('enter ');

    }, [userChatId])

    // useEffect(() => {

    //     if (ChatUser?.userName && userChatId) {
    //         const isFriend = ChatUser.friendlist.includes(userChatId) || false;
    //         setIsFriend(isFriend)

    //     }

    // }, [ChatUser, userChatId])


    useEffect(() => {
        if (ChatUser?._id && onlineUsers) {

            setIsOnlineUser(!onlineUsers?.includes(ChatUser._id))
        }
    }, [ChatUser?._id, onlineUsers])


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!chatText) return;
        setChatSendisLoaded(true);

        const data = { receiverId: userChatId, msg: chatText };

        if (socket) {
            socket?.emit('newMsg', data);

            if (conversation._id) {
                const updatedMessages = [...conversation.messages, {
                    senderId: user?._id ?? '',
                    receiverId: userChatId ?? '',
                    message: chatText ?? '',
                }];

                dispatch(setConversation({
                    conversation: {
                        ...conversation,
                        messages: updatedMessages
                    }
                }));
            }
        }

        try {
            const apiURL = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.post(apiURL + "/message/chat", data, { withCredentials: true });

            if (!conversation._id && response.data.conversation) {
                dispatch(setConversation(response.data));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setChatText('');
            setChatSendisLoaded(false);
        }
    };




    useEffect(() => {

        if (socket && conversation?._id) {
            socket.on('recieveMSG', (da) => {

                let newedit = { conversation: { _id: conversation?._id, messages: [...conversation?.messages, da], participants: conversation?.participants } }
                dispatch(setConversation(newedit))


            })
        }

        autoScrollDown()
    }, [socket, conversation])

    const autoScrollDown = () => {

        wholeChatRefEle.current?.scrollTo(0, wholeChatRefEle.current?.scrollHeight)
        wholeChatRefEle.current?.scroll({ behavior: 'smooth' })

    }
    // console.log(conversation);
    const openCalltap = () => {

        if (isOnlineUser) return
        callUser(ChatUser?._id ?? "")
        navigate('/call');
    }


    return (
        <>
            {isLoaded && <div className='w-full h-full flex flex-col justify-between overflow-hidden border border-gray-400  '>
                <div className='flex flex-row justify-between items-start px-5 py-3 border-b-2 border-gray-200 '>
                    <div className="flex-row flex justify-between items-start ">
                        <div className="flex ms-14 flex-col justify-center items-center">
                            <h5 className='text-md font-semibold'>{ChatUser?.userName.trim().substring(0, 20)}</h5>
                            <p className={`text-[14px] font-semibold ${onlineUsers?.some((usr) => usr.toString() === ChatUser?._id?.toString())
                                ? "text-green-400" : ""}`}>
                                {onlineUsers?.some((usr) => usr.toString() === ChatUser?._id?.toString())
                                    ? "Online" : "Offline"}
                            </p>                        </div>
                    </div>
                    <button disabled={isOnlineUser} onClick={openCalltap} className='p-4 bg-green-300 rounded-lg'><i className="fa-solid fa-video"></i></button>
                </div>

                <div ref={wholeChatRefEle} className="bg-gray-800 p-4 w-full flex flex-col gap-3 h-full overflow-x-scroll hide_scroll_bar ">
                    {conversation._id && userChatId ?
                        conversation.messages.map(((msg, index) =>

                            <div key={index} className={`w-full flex flex-row items-center ${msg?.receiverId === userChatId ? "justify-end" : "justify-start"}
                             h-fit text-wrap `}>
                                <p className={`w-56 bg-green-400 px-2 py-2 
                                 overflow-hidden
                                 rounded-md  text-lg font-semibold text-wrap wrap ${msg?.receiverId === userChatId ? "text-end" : "text-start"}`}>{msg?.message.toString()}</p>
                            </div>
                        ))
                        : <>no chat there</>
                    }


                </div>
                <form id='chatInput' onSubmit={handleSubmit} className='  bottom-0   flex flex-row h-[40px] items-center justify-between w-full border-red-300 border-t-2  '>
                    <input type="text" value={chatText} onChange={(e) => { setChatText(e.target.value) }} className='py-3 px-2 outline-none border-none w-full h-full  text-lg text-md font-bold' />
                    <button type='submit' form='chatInput' className='px-2 py-3 text-center h-full w-20'>{ChatSendisLoaded ? <i className='fa-solid fa-spinner'></i> : <i className=' fa-solid fa-paper-plane  '></i>}</button>
                </form>

            </div>}
        </>
    )
}

export default UserChat

