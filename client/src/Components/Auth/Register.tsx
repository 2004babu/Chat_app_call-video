import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { RootState } from "../../Redux/Store"
import dompurify from 'dompurify'
import { sighInWithGoogle, signUpEmailAndPassword } from "../../fire_base"
import { toast } from "react-toastify"
import { Helmet } from "react-helmet-async"
import { setUser } from "../../Redux/Slices/UserSlice"


interface userType {
  userName: string,
  email: string,
  password: string,
  c_password: string,
}
const Register = () => {



  const [user, setUserInput] = useState<userType>({ userName: "", email: "", c_password: "", password: "" })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // const dispatch = useDispatch()
  const [submitLoading, setIssubmitLoading] = useState<boolean>(false)


  const { user: C_User } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (C_User?.uid) {
      navigate('/')
    }
  }, [C_User?.uid, submitLoading])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    setUserInput({ ...user, [e.target.name]: dompurify.sanitize(e.target.value) })

  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!user.userName || !emailRegex.test(user.email) || !(user.password.length > 5)) {
      toast('Not Valid Details');
      return

    }

    if (user.password !== user.c_password) {
      return toast('Password does\'nt match ! ');
      
    }
    try {
      setIssubmitLoading(true)

      const message = await signUpEmailAndPassword(user.email, user.password, user.userName);
      if (message.userName || message.displayName) {

        toast(message.userName ?? message.displayName)
        dispatch(setUser(message))
      }
    } catch (error) {
      console.log(error);

    } finally {
      navigate('/')
      setIssubmitLoading(false)
    }


  }

  const handleGoogleLogin = async () => {
    const response = await sighInWithGoogle()
    if (response?.uid) {
      dispatch(setUser(response))
      return navigate('/')
    }
  }



  return (
    <div className='flex h-screen  w-screen justify-center items-center '>
      <Helmet title="Sign Up Chat" />

      {/* <form onSubmit={handleSubmit} className='flex max-[800px]:flex-row justify-start items-center  h-fit w-auto gap-2  rounded-lg gap-2   shadow-lg shadow-cyan-500/50'>
        <div className="flex flex-col justify-start items-center  h-fit w-96   rounded-lg gap-2  p-4  ">
          <h1 className="font-bold text-lg ">LOGIN</h1>
          <div className="bg-white border-gray flex flex-col gap-2 rounded-lg p-1 w-80 ">
            <label htmlFor="email" className="font-semibold  text-[12px]">Email</label>
            <input onChange={handleChange} type="email" required name="email" className="px-3 py-2 rounded-lg  bg-white outline-none border border-gray-300  " />
          </div>
          <div className="bg-white w-80 rounded-lg p-1 flex flex-col gap-2">
            <label className="font-semibold text-[12px]" htmlFor="password">password</label>
            <input onChange={handleChange} type="password" required name="password" className="px-3 py-2 rounded-lg  bg-white outline-none border border-gray-300 " />
          </div>


          <button disabled={submitLoading} type="submit" className=" font-bold bg-green-400 w-80 px-3 py-2  cursor-pointer  mt-4 rounded-sm  "> login</button>
          <button className="font-bold bg-gray-500 w-80 px-3 py-2  cursor-pointer text-white mt-4 rounded-sm   flex-row flex gap-2 items-center justify-center" onClick={sighInWithGoogle}><i className="fa-brands fa-google"></i>  Sign In with Google </button>
          <div className="flex flex-row items-start w-full  mt-3 p-1 text-[10px] font-normal text-blue-500">
            <Link to={'/signup'}>Don't Have A Account?</Link>
          </div>
        </div>
        <div className="max-[800px]:hidden w-90 h-100 p-3 font-bold text-sm text-white bg-green-400 flex flex-col gap-4 justify-center items-center">

          <h1 className="font-bold text-white text-2xl"> Welcome back!</h1>
          Welcome back! We are so happy to have you
          here. It's great to see you again. We hope you
          had a safe and enjoyable time away.

        </div>

      </form> */}

      <form onSubmit={handleSubmit} className='flex max-[800px]:flex-row justify-center items-center  h-[600px] w-auto text-white rounded-lg gap-2'>
        <div className="flex flex-col justify-start items-center  h-[600px] w-96   rounded-lg gap-2  p-4  ">
          <h1 className="font-bold text-lg ">SIGN UP</h1>
          <div className="bg-white border-gray flex flex-col gap-2 rounded-lg p-1 w-full ">
            <label className="font-semibold text-[12px] text-gray-700" htmlFor="userName">userName</label>
            <input onChange={handleChange} type="text" required name="userName" id="userName" className="px-3 py-2 rounded-lg  bg-white outline-none border border-gray-300" />
          </div>
          <div className="bg-white border-gray flex flex-col gap-2 rounded-lg p-1 w-full">
            <label className="font-semibold text-[12px] text-gray-700" htmlFor="email">Email</label>
            <input onChange={handleChange} type="email" required name="email" className="px-3 py-2 rounded-lg  bg-white outline-none border border-gray-300" />
          </div>
          <div className="bg-white border-gray flex flex-col gap-2 rounded-lg p-1 w-full">
            <label className="font-semibold text-[12px] text-gray-700" htmlFor="password">password</label>
            <input onChange={handleChange} type="password" required name="password" className="px-3 py-2  rounded-lg  bg-white outline-none border border-gray-300" />
          </div>
          <div className="bg-white border-gray flex flex-col gap-2 rounded-lg p-1 w-full">
            <label className="font-semibold text-[12px] text-gray-700" htmlFor="c_password">Confirm password</label>
            <input onChange={handleChange} type="password" required name="c_password" className="px-3 py-2 rounded-lg  bg-white outline-none border border-gray-300" />
          </div>
          <button disabled={submitLoading} type="submit" className="font-bold bg-green-400 w-80 px-3 py-2  cursor-pointer  mt-4 rounded-sm  "> SignUp</button>
          <button className="font-bold bg-gray-500 w-80 px-3 py-2  cursor-pointer text-white mt-4 rounded-sm   flex-row flex gap-2 items-center justify-center" onClick={handleGoogleLogin}><i className="fa-brands fa-google"></i>  Sign In with Google </button>

          <div className="flex flex-row items-start w-full  mt-3 p-1 text-[10px] font-normal text-blue-500">
            <Link to={'/login'}>Already Have A Account?</Link>
          </div>

        </div>
        <div className="max-[800px]:hidden w-90 h-[600px] p-3 font-bold text-sm text-white bg-linear-30 bg-green-400 flex flex-col gap-4 justify-center items-center" >

          <h1 className="font-bold text-white text-2xl"> Welcome back!</h1>
          Welcome back! We are so happy to have you
          here. It's great to see you again. We hope you
          had a safe and enjoyable time away.

        </div>
      </form>
    </div>
  )
}

export default Register
