import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setChatUser, setSeenUnReadedMsg, setUser, setUsers } from '../../Redux/Slices/UserSlice'
import { RootState } from '../../Redux/Store'
import { useNavigate, useParams } from 'react-router-dom'
import { setConversation } from '../../Redux/Slices/messageSlice'

import { useCall } from '../Call/Call'
import { useSocketContext } from '../Context/SocketContext'
import { Helmet } from 'react-helmet-async'


const UserChat = () => {
    const { id: userChatId } = useParams()
    if (!userChatId) {
        return null
    }



    const inputRef = useRef<HTMLInputElement | null>(null)
    const [isOnlineUser, setIsOnlineUser] = useState<boolean>(false)
    const dispatch = useDispatch()
    const [isLoaded, setisLoaded] = useState<boolean>(false)
    const [ChatSendisLoaded, setChatSendisLoaded] = useState<boolean>(false)
    const [chatText, setChatText] = useState<string>('')

    const { ChatUser, user, users } = useSelector((state: RootState) => state.user)
    const { conversation } = useSelector((state: RootState) => state.conversation)


    const navigate = useNavigate()
    const wholeChatRefEle = useRef<HTMLDivElement>(null)

    const { callUser } = useCall()!;
    const { socket, onlineUsers } = useSocketContext()!

    const { id } = useParams()



    const getSingleUser = async () => {
        try {
            setisLoaded(false)

            const apiURL = import.meta.env.VITE_BACKEND_URL
            const response = await axios.get(apiURL + "/auth/user?id=" + userChatId, { withCredentials: true })

            if (response.data.user) {

                dispatch(setChatUser(response.data.user))
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

                dispatch(setUser(response.data.user))
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

    }, [userChatId])

    // useEffect(() => {

    //     if (ChatUser?.userName && userChatId) {
    //         const isFriend = ChatUser.friendlist.includes(userChatId) || false;
    //         setIsFriend(isFriend)

    //     }

    // }, [ChatUser, userChatId])


    useEffect(() => {
        if (ChatUser && onlineUsers) {

            setIsOnlineUser(!onlineUsers?.includes(ChatUser.uid))
        }
    }, [ChatUser, onlineUsers])
    // console.log( onlineUsers?.some((usr) => usr.toString() === ChatUser?.uid?.toString() )  );


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!chatText) return;
        setChatSendisLoaded(true);

        const data = { senderId: user?.uid, receiverId: userChatId, msg: chatText };

        if (socket) {

            let filteredUsers = [];


            filteredUsers = users.filter(Item => Item.uid.toString() !== userChatId.toString())
            let findedUser = users.filter(Item => Item.uid.toString() === userChatId.toString())
            // console.log(findedUser, filteredUsers);

            dispatch(setUsers([...findedUser, ...filteredUsers]))

            socket?.emit('newMsg', data);

            if (conversation._id) {

                console.log(conversation, data);


                const updatedMessages = [...conversation.messages, {
                    senderId: user?.uid ?? '',
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
            if (inputRef.current) {
                inputRef.current.focus()
            }
        }
    };




    useEffect(() => {
        if (!socket || !conversation?._id || !id) return;

        
        const handler = (da: any) => {
            console.log(conversation.participants,da.senderId,id);
            const isInConversation =
                da.senderId &&
                conversation.participants.includes(da.senderId) &&
                conversation.participants.includes(id);

            if (isInConversation) {
                const updatedConversation = {
                    conversation: {
                        _id: conversation._id,
                        messages: [...conversation.messages, da],
                        participants: conversation.participants,
                    },
                };

                dispatch(setConversation(updatedConversation));
            }
        };

        socket.on('recieveMSG', handler);

        if (inputRef.current) {
            inputRef.current.focus()
        }
        autoScrollDown()
        return () => {
            socket.off('recieveMSG', handler); // Cleanup to prevent duplicate listeners
        };
    }, [socket, conversation, id, dispatch]);





    const autoScrollDown = () => {

        wholeChatRefEle.current?.scrollTo(0, wholeChatRefEle.current?.scrollHeight)
        wholeChatRefEle.current?.scroll({ behavior: 'smooth' })


    }
    // console.log(conversation);
    const openCalltap = () => {

        if (isOnlineUser) return
        callUser(ChatUser?.uid ?? "")
        navigate('/call');
    }

    const setSeenedMsgServer = async (id: string) => {
        dispatch(setSeenUnReadedMsg({ Re_user: id }))
        try {
            const apiURL = import.meta.env.VITE_BACKEND_URL;
            await axios.post(apiURL + "/message/seenedmsg", { chatUserId: id }, { withCredentials: true });
        } catch (error) {
            console.log(error);

        }
    }
    useEffect(() => {
        if (id) {
            console.log(id);
            
            setSeenedMsgServer(id)
        }


    }, [id])
    useEffect(() => {
        if (socket) {
            socket?.on('recieveMSG', (data) => {
                if (data.senderId === id) {
                    setSeenedMsgServer(data.senderId)
                    console.log(data);

                }


            })
        }

        return () => {
            socket?.off('recieveMSG');
        }
    }, [socket])


    return (
        <>
            <Helmet title={ChatUser?.userName ?? ChatUser?.email} />

            {isLoaded && <div className='w-full h-full flex flex-col justify-between overflow-hidden border border-gray-400  '>
                <div className='flex flex-row justify-between items-start px-5 py-3 border-b-2 border-gray-200 '>
                    <div className="flex-row flex justify-between items-start ">
                        <div className="flex ms-14 flex-col justify-center items-center">
                            <h5 className='text-md font-semibold'>{ChatUser?.userName && ChatUser?.userName.trim().substring(0, 20)}</h5>
                            <p className={`text-[14px] font-semibold ${onlineUsers?.some((usr) => usr.toString() === ChatUser?.uid?.toString())
                                ? "text-green-400" : ""}`}>
                                {onlineUsers?.some((usr) => usr.toString() === ChatUser?.uid?.toString())
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
                                <h1 className={`w-56 bg-white px-2 py-1.5 
                                 overflow-hidden
                                 rounded-md  flex-col  flex text-lg font-semibold text-wrap wrap ${msg?.receiverId === userChatId ? "text-end" : "text-start"}`}>{msg?.message.toString()}</h1>
                            </div>
                        ))
                        : <div className='flex flex-col w-ful rounded h-16 items-center justify-center
                         bg-gray-500 text-gray-100 p-2 '><p className='text-lg font-bold  '> Start Conversation</p></div>
                    }


                </div>
                <form id='chatInput' onSubmit={handleSubmit} className='  bottom-0   flex flex-row h-[40px] items-center justify-between w-full border-red-300 border-t-2  '>
                    <input type="text" ref={inputRef} value={chatText} onChange={(e) => { setChatText(e.target.value) }} className='py-3 px-2 outline-none border-none w-full h-full  text-lg text-md font-bold' />
                    <button type='submit' form='chatInput' className='px-2 py-3 text-center h-full w-20'>{ChatSendisLoaded ? <i className='fa-solid fa-spinner'></i> : <i className=' fa-solid fa-paper-plane  '></i>}</button>
                </form>

            </div>}
        </>
    )
}

export default UserChat

