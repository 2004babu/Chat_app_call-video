
import InfiniteScroll from 'react-infinite-scroll-component'
import { UserState } from '../../Redux/Slices/UserSlice'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from '../Context/SocketContext';

interface userListType { users: UserState['searchUsers'], hasMore: boolean, fetchUser: () => void }

const UserList: React.FC<userListType> = ({ users, hasMore, fetchUser }) => {


    const navigate = useNavigate()
    const from = location.href.substring(location.origin.length)
    const handelOpenUser = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
        console.log(from);
        e.stopPropagation();
        console.log('open user Chat', id);
        navigate('/userchat/' + id, { state: { from } })
    };

    const { onlineUsers } = useSocketContext()!


    return (
        <InfiniteScroll dataLength={users?.length} hasMore={hasMore} next={fetchUser} loader={<>loader</>}>
            {users?.length ? users?.map((ite) => (
                <div onClick={(e) => handelOpenUser(e, ite._id)} key={ite._id} className='flex flex-row justify-between items-start px-2 py-3 border-b-2 border-gray-200 '>
                    <div className="flex-row flex justify-between items-start ">
                        {/* <div className='h-90 w-100'>  <img className='h-10 w-10' src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg" alt="dfjbdk" /></div> */}
                        <div className="flex flex-col justify-center items-center px-2 ">
                            <h5 className='text-md font-semibold'>{ite.userName.trim().substring(0,10)}</h5>
                            <p className={`text-[14px] font-semibold ${onlineUsers?.some((usr) => usr.toString() === ite?._id?.toString())
                                ? "text-green-400" : "text-red-300"}`}>
                                {onlineUsers?.some((usr) => usr.toString() === ite?._id?.toString())
                                    ? "Online" : "Offline"}
                            </p>
                        </div>
                    </div>
                    <p><i className="fa-solid fa-comment"></i></p>
                </div>)) : (<></>)}
        </InfiniteScroll>
    )
}

export default UserList
