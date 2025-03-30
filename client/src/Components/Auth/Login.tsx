// import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
// import { setUser as setStateUser } from '../../Redux/Slices/UserSlice'
import { RootState } from "../../Redux/Store"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { sighInWithEmail, sighInWithGoogle } from "../../fire_base"
import dompurify from 'dompurify'
import { Helmet } from "react-helmet-async"

interface userType {
  email: string,
  password: string,
}
const Login = () => {
  const [user, setUser] = useState<userType>({ email: "", password: "" })
  // const dispatch = useDispatch()
  const [submitLoading, setIssubmitLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const { user: C_User } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (C_User?.uid) {
      navigate('/')
    }
  }, [C_User?.uid])


  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // dompurify.sanitize(e.target.value)
    setUser({ ...user, [e.target.name]: dompurify.sanitize(e.target.value) })

  }

  const UserState = useSelector((state: RootState) => state.user)
  console.log(UserState);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(user.email) || !user.password) {
      return toast('Not valid data!')
    }


    // try {
    // setIssubmitLoading(true)
    //   const apiURL = import.meta.env.VITE_BACKEND_URL
    //   const response = await axios.post(apiURL + "/auth/login", user, { withCredentials: true })
    //   console.log(response.data.user);

    //   if (response.data.user) {

    //     dispatch(setStateUser(response.data))
    //     navigate('/')
    //   }
    //   // sendToast(response.data.message, null)



    // } catch (error) {
    //   if (axios.isAxiosError(error)) {

    //     toast(error?.response?.data?.message || "An error occurred while connecting to the server")
    //   } else {

    //     toast((error as Error).message)
    //   }
    //   console.log(error);

    // } finally {
    // setIssubmitLoading(false)

    // }


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

  console.log(submitLoading);
  

  return (
    <div className='flex h-screen  w-screen justify-center items-center '>
      <Helmet title="login Chat"/>
      <form onSubmit={handleSubmit} className='flex flex-col justify-start items-center  h-fit w-80   rounded-lg gap-2  p-4 shadow-lg shadow-cyan-500/50'>
        <h1 className="font-bold text-lg ">LOGIN</h1>
        <div className="bg-white border-gray flex flex-col gap-2 rounded-lg p-1 w-full ">
          <label htmlFor="email" className="font-semibold text-[12px]">email</label>
          <input onChange={handleChange} type="email" required name="email" className="px-3 py-2 rounded-lg  bg-white outline-none border border-gray-300  " />
        </div>
        <div className="bg-white w-full rounded-lg p-1 flex flex-col gap-2">
          <label className="font-semibold text-[12px]" htmlFor="password">password</label>
          <input onChange={handleChange} type="password" required name="password" className="px-3 py-2 rounded-lg  bg-white outline-none border border-gray-300 " />
        </div>


        <button disabled={submitLoading} type="submit" className="bg-green-400 px-4  py-1 cursor-pointer  mt-4 rounded-sm  "> login</button>
        <button className="p-2 cursor-pointer bg-black text-white text-md font-semibold  border-gray-400 border  " onClick={sighInWithGoogle}>Sign In with Google</button>
        <div className="flex flex-row items-start w-full  mt-3 p-1 text-[10px] font-normal text-blue-500">
          <Link to={'/signup'}>Don't Have A Account?</Link>
        </div>

      </form>
    </div>
  )
}










export default Login
