import axios from 'axios'
import { ChangeEvent, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../Redux/Store'
import { clearsearchUsers, setsearchUsers } from '../../Redux/Slices/UserSlice'
import UserList from '../Static/UserList'

const SearchAcc = () => {



    ///For Infinite Scroll
    const [page, setPage] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)




    const users = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>()
    // console.log(users);



    const abortcontrollerref = useRef<AbortController | null>(null)
    const [search, setSearch] = useState<string>("")


    const fetchUser = async (userName: string = search, onPage: number = page) => {

        try {
            console.log(onPage);

            if (userName.trim() === '') {
                dispatch(clearsearchUsers())

                return console.log('emty value!!');


            }
            if (abortcontrollerref.current) abortcontrollerref.current.abort()
            const apiURL = import.meta.env.VITE_BACKEND_URL
            abortcontrollerref.current = new AbortController();

            const response = await axios.post(apiURL + "/message/searchAccount", { search: userName, onPage }, { withCredentials: true, signal: abortcontrollerref.current.signal })

            if (response?.data?.users) {
                console.log(response.data);
                let newuserslist: any
                console.log(users?.searchUsers);

                if (users?.searchUsers?.length) {
                    if (page !== 0) {

                        newuserslist = { searchUsers: [...users.searchUsers, ...response.data.users] };
                    }

                    newuserslist = { searchUsers: response.data.users };
                } else {
                    newuserslist = { searchUsers: response.data.users };
                }

                console.log(newuserslist);

                dispatch(setsearchUsers(newuserslist));

                if (response.data.users.length < 2) {
                    setHasMore(false)
                } else {
                    // setPage(page + 1)
                    // setHasMore(true)
                }
            }

        } catch (error) {
            if ((error as Error).name === 'AbortError') {
                console.log('abort Error');

            }
            dispatch(clearsearchUsers())

            console.log(error);

        }

    }

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setPage(0)
        setSearch(e.target.value)
        fetchUser(e.target.value, 0)
        // console.log(e);

    }
    console.log(hasMore,page);

    return (
        <div className='w-full h-full'>
            <div className="text-[16px] font-semibold flex flex-row justify-between bg-gray-400 items-center px-2 gap-5 py-3">
                {search &&<button type='button'>
                    <i className='fa fa-arrow-left'></i>
                </button>}
                <input value={search} placeholder='Search' onChange={changeHandler} type="text" name="searchAcc" id="searchAcc" className="px-2 py-3 bg-gray-300  w-full outline-none rounded-lg" />

            </div>

            {users?.searchUsers?.length > 0 && <UserList fetchUser={fetchUser} hasMore={hasMore} users={users.searchUsers} />}
        </div>
    )
}

export default SearchAcc
