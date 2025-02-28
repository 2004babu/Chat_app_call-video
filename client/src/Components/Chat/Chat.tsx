import axios from 'axios'
import { useEffect } from 'react'
import UserList from '../Static/UserList'
import { setUsers } from '../../Redux/Slices/UserSlice'
import { AppDispatch, RootState } from '../../Redux/Store'
import { useDispatch, useSelector } from 'react-redux'

const Chat = () => {


 

    const users = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>()



    useEffect(() => {
        getUsers()
    }, [])
    const getUsers = async () => {
        try {
            const apiURL = import.meta.env.VITE_BACKEND_URL
            const response = await axios.get(apiURL + "/message/listAccounts", { withCredentials: true })

            if (response.data.users) {
                dispatch(setUsers(response.data))
            }
        } catch (error) {

            console.log(error);

        }

    }




    return (
        <div className='flex flex-col w-full h-ful'>
            <UserList   hasMore={false}  fetchUser={getUsers}  users={users.users} />
        </div>
    )
}

export default Chat

