import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from './Components/Auth/Login'
import Register from './Components/Auth/Register'
import { ToastContainer } from 'react-toastify'
import Home from './Components/Home'
import IsAuthUser from './Components/Static/IsAuthUser'

import Chat from './Components/Chat/Chat'
import { useEffect, useState } from 'react'
import axios from 'axios'
import sendToast from './Components/utils/SendToast'
import {  setUser } from './Redux/Slices/UserSlice'

import { useDispatch } from "react-redux"
import SearchAcc from './Components/Auth/SearchAcc'
import CallInterface from './Components/Call/CallInterface'
import { Call, useCall } from './Components/Call/Call'
import SocketContext from './Components/Context/SocketContext'
import CallAlert from './Components/Call/CallAlert'

function App() {


  const call = useCall()!;
  const navigate = useNavigate()
  useEffect(() => {
    console.log('enter');

    if (!call?.call) {
      navigate('/');
    } else {
      navigate('/call');

    }
  }, [call?.call]);

  const dispatch = useDispatch()
  const [isLoaded, setisLoaded] = useState<boolean>(false)


  const loadUser = async () => {
    try {
      setisLoaded(false)

      const apiURL = import.meta.env.VITE_BACKEND_URL
      const response = await axios.get(apiURL + "/auth/loadUser", { withCredentials: true })
      console.log(response.data.user);

      if (response.data.user) {

        dispatch(setUser(response.data))
        // navigate('/')
      }
      sendToast(response.data.message, null)

    } catch (error) {
      console.log(error);

    } finally {
      setisLoaded(true)
    }
  }
  useEffect(() => {
    loadUser()
  }, [])



  return (
    <>
      <ToastContainer autoClose={2000} closeOnClick={true} limit={2} hideProgressBar={true} />
      <SocketContext>
        <Call >
          <CallAlert />
          {isLoaded && <Routes>
            {/* <Route path='/' element={<IsAuthUser><Home /></IsAuthUser>} /> */}
            <Route path='/' element={<IsAuthUser><Home ><Chat /></Home></IsAuthUser>} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Register />} />
            <Route path='/call' element={<IsAuthUser><CallInterface /></IsAuthUser>} />
            <Route path='/addFrd' element={<IsAuthUser><SearchAcc /></IsAuthUser>} />
            <Route path='/chat' element={<IsAuthUser><Home ><Chat /></Home></IsAuthUser>} />
            <Route path='/userchat/:id' element={<IsAuthUser><Home sideContent={true}><Chat /></Home></IsAuthUser>} />
          </Routes>}
        </Call>
      </SocketContext>
    </>
  )
}

export default App
