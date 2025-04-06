import axios from 'axios'
import { useEffect } from 'react'
import {  setUsers } from '../../Redux/Slices/UserSlice'
import { AppDispatch, RootState } from '../../Redux/Store'
import { useDispatch, useSelector } from 'react-redux'
import {  useNavigate } from 'react-router-dom'
import { useSocketContext } from '../Context/SocketContext'

const Chat = () => {




    const { users, user } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>()



    const getUsers = async () => {
        try {
            const apiURL = import.meta.env.VITE_BACKEND_URL
            const response = await axios.get(apiURL + "/message/listAccounts", { withCredentials: true })

            if (response.data.users) {
                console.log(response.data.users);

                dispatch(setUsers(response.data.users))
            }
        } catch (error) {

            console.log(error);

        }

    }

    useEffect(() => {
        getUsers()
    }, [])

    const navigate = useNavigate()
    const from = location.href.substring(location.origin.length)
    const handelOpenUser = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
        console.log(from);
        e.stopPropagation();
        // console.log('open user Chat', id);
        return navigate('/userchat/' + id, { state: { from } })
    };

    const { onlineUsers } = useSocketContext()!

    console.log(user?.UnReadedMsg);
    
    return (
        <div className='flex flex-col w-full h-ful'>
            {users?.length ? users?.map((ite) => (
                <div onClick={(e) => handelOpenUser(e, ite.uid)} key={ite?.uid} className='flex flex-row justify-between items-start px-2 py-3 border-b-2 border-gray-200 '>
                    <div className="flex-row flex justify-between items-start ">
                        <div className='h-10 w-10 relative'>
                            <p className={`text-[14px] font-semibold absolute top-1 right-0.5 ${onlineUsers?.some((usr) => usr.toString() === ite?.uid?.toString())
                                ? "bg-green-600 h-3 w-3 rounded-full" : ""}`}>
                                
                            </p>
                            <img className='h-10 w-10 rounded-full' src={ite.profilePic ?? "https://tse1.mm.bing.net/th?id=OIP._jWJU88HhaBBRUhhr6FhjQAAAA&pid=Api&P=0&h=220"} alt="dfjbdk" /></div>
                        <div className="flex flex-col justify-center items-start px-2  ">
                            <h5 className='text-sm font-semibold flex-row flex'>{ite?.userName && ite?.userName.trim().substring(0, 10)} </h5>
                            {user?.UnReadedMsg && user?.UnReadedMsg.some(data => data.Re_user === ite.uid.toString()) && <>
                                {user?.UnReadedMsg.map(msg => {
                                    if (msg.Re_user === ite.uid) {
                                        return <div className='flex flex-row w-80 justify-start items-center gap-2'>
                                            <h1 className='text-gray-500 font-semibold text-sm'>{msg.message.substring(0, 10)}..  </h1>
                                           { msg.seened===false&&<p className='flex flex-col text-[12px] font-semibold text-white bg-green-500 rounded-full w-4 h-4 justify-center items-center'>{msg.count}</p>}
                                        </div>
                                    } return null
                                }


                                )}

                                {/* <p><i className="bg-green-400 fa-solid fa-comment"></i></p> */}
                            </>
                            }

                        </div>
                    </div>

                </div>)) : (<></>)}
        </div>
    )
}

export default Chat

