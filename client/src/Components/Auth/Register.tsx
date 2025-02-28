import axios from "axios"
import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { clearUser, setUser as setStateUser } from '../../Redux/Slices/UserSlice'
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"


interface userType {
  userName: string,
  email: string,
  password: string,
  c_password: string,
}
const Register = () => {

  const [user, setUser] = useState<userType>({ userName: "", email: "", c_password: "", password: "" })

  const navigate = useNavigate()

  const dispatch = useDispatch()
  const [submitLoading, setIssubmitLoading] = useState<boolean>(false)


  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    setUser({ ...user, [e.target.name]: e.target.value })

  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!user.userName || !emailRegex.test(user.email) || !(user.password.length > 5)) {
      console.log('Not Valid Details');
      return

    }

    if (user.password !== user.c_password) {
      return console.log('Password does\'nt match ! ');

    }

    try {
      setIssubmitLoading(true)
      const apiURL = import.meta.env.VITE_BACKEND_URL
      const response = await axios.post(apiURL + "/auth/signup", user, { withCredentials: true })

      if (response.data.user) {

        dispatch(setStateUser(response.data))
        navigate('/')
      }
      toast(response.data.message)



    } catch (error) {
      if (axios.isAxiosError(error)) {

        toast(error?.response?.data?.message || "An error occurred while connecting to the server")
      } else {

        toast((error as Error).message)
      }
      console.log(error);
    } finally {
      setIssubmitLoading(false)

    }

  }

  console.log(submitLoading);


  return (
    <div className='flex h-screen  w-screen justify-center items-center '>
      <form onSubmit={handleSubmit} className='flex flex-col justify-start items-center  h-fit w-80   rounded-lg gap-2  p-4 shadow-lg shadow-cyan-500/50'>
        <h1 className="font-bold text-lg ">SIGN UP</h1>
        <div className="bg-white border-gray flex flex-col gap-2 rounded-lg p-1 w-full ">
          <label className="font-semibold text-[12px]" htmlFor="userName">userName</label>
          <input onChange={handleChange} type="text" required name="userName" id="userName" className="px-3 py-2 rounded-lg  bg-white outline-none border border-gray-300" />
        </div>
        <div className="bg-white border-gray flex flex-col gap-2 rounded-lg p-1 w-full">
          <label className="font-semibold text-[12px]" htmlFor="email">email</label>
          <input onChange={handleChange} type="email" required name="email" className="px-3 py-2 rounded-lg  bg-white outline-none border border-gray-300" />
        </div>
        <div className="bg-white border-gray flex flex-col gap-2 rounded-lg p-1 w-full">
          <label className="font-semibold text-[12px]" htmlFor="password">password</label>
          <input onChange={handleChange} type="password" required name="password" className="px-3 py-2 rounded-lg  bg-white outline-none border border-gray-300" />
        </div>
        <div className="bg-white border-gray flex flex-col gap-2 rounded-lg p-1 w-full">
          <label className="font-semibold text-[12px]" htmlFor="c_password">c_password</label>
          <input onChange={handleChange} type="password" required name="c_password" className="px-3 py-2 rounded-lg  bg-white outline-none border border-gray-300" />
        </div>
        <button disabled={submitLoading} type="submit" className="bg-green-400 px-4  py-1  mt-4 rounded-sm   "> SignUp</button>
        <div className="flex flex-row items-start w-full  mt-3 p-1 text-[10px] font-normal text-blue-500">
          <Link to={'/login'}>Already Have A Account?</Link>
        </div>

      </form>
    </div>
  )
}

export default Register
