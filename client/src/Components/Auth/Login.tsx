import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../Redux/Store"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { sighInWithEmail, sighInWithGoogle } from "../../fire_base"
import dompurify from 'dompurify'
import { Helmet } from "react-helmet-async"
import { setUser } from "../../Redux/Slices/UserSlice"

interface userType {
  email: string,
  password: string,
}
const Login = () => {
  const [user, setUserDatail] = useState<userType>({ email: "", password: "" })
  const dispatch = useDispatch()
  const [submitLoading, setIssubmitLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const { user: C_User } = useSelector((state: RootState) => state.user)


  useEffect(() => {
    if (C_User?.uid) {
      navigate('/')
    }
  }, [C_User?.uid])


  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDatail({ ...user, [e.target.name]: dompurify.sanitize(e.target.value) })

  }

  const UserState = useSelector((state: RootState) => state.user)
  console.log(UserState);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(user.email) || !user.password) {
      return toast('Not valid data!')
    }


    try {
      setIssubmitLoading(true)

      const message = await sighInWithEmail(user.email, user.password)
      toast(message)
    } catch (error) {
      console.log(error);

    } finally {

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
      <Helmet title="login Chat" />
      <form onSubmit={handleSubmit} className='flex max-[800px]:flex-row justify-start items-center  h-fit w-auto gap-2  rounded-lg gap-2   shadow-lg shadow-cyan-500/50'>
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


          <button disabled={submitLoading} type="submit" className=" font-bold bg-green-400 w-80 px-3 py-2  text-white cursor-pointer  mt-4 rounded-sm  "> login</button>
          <button className="font-bold bg-gray-500 w-80 px-3 py-2  cursor-pointer text-white mt-4 rounded-sm   flex-row flex gap-2 items-center justify-center" onClick={handleGoogleLogin}><i className="fa-brands fa-google"></i>  Sign In with Google </button>
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

      </form>
    </div>
  )
}










export default Login
