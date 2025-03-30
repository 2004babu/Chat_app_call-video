import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { RootState } from "../../Redux/Store"
import dompurify from 'dompurify'
import { sighInWithGoogle, signUpEmailAndPassword } from "../../fire_base"
import { toast } from "react-toastify"
import { Helmet } from "react-helmet-async"


interface userType {
  userName: string,
  email: string,
  password: string,
  c_password: string,
}
const Register = () => {

  const [user, setUser] = useState<userType>({ userName: "", email: "", c_password: "", password: "" })

  const navigate = useNavigate()

  // const dispatch = useDispatch()
  const [submitLoading, setIssubmitLoading] = useState<boolean>(false)


  const { user: C_User } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (C_User?.uid) {
      navigate('/')
    }
  }, [C_User?.uid])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    setUser({ ...user, [e.target.name]: dompurify.sanitize(e.target.value) })

  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!user.userName || !emailRegex.test(user.email) || !(user.password.length > 5)) {
      toast('Not Valid Details');
      return

    }

    if (user.password !== user.c_password) {
      return  toast('Password does\'nt match ! ');

    }

    // try {
    //   const apiURL = import.meta.env.VITE_BACKEND_URL
    //   const response = await axios.post(apiURL + "/auth/signup", user, { withCredentials: true })

    //   if (response.data.user) {

    //     dispatch(setStateUser(response.data))
    //     navigate('/')
    //   }
    //   toast(response.data.message)



    // } catch (error) {
    //   if (axios.isAxiosError(error)) {

    //     toast(error?.response?.data?.message || "An error occurred while connecting to the server")
    //   } else {

    //     toast((error as Error).message)
    //   }
    //   console.log(error);
    // } finally {

    // }
    try {
      setIssubmitLoading(true)

      const message = await signUpEmailAndPassword(user.email, user.password, user.userName);
      toast(message)
    } catch (error) {
      console.log(error);

    } finally {

      setIssubmitLoading(false)
    }


  }



  return (
    <div className='flex h-screen  w-screen justify-center items-center '>
            <Helmet title="Sign Up Chat"/>

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
        <button disabled={submitLoading} type="submit" className="bg-green-400 px-4  cursor-pointer py-1  mt-4 rounded-sm   "> SignUp</button>
        <button className="p-2 cursor-pointer text-black bg-white text-md font-semibold  border-gray-400 border  " onClick={sighInWithGoogle}>Sign In with Google</button>

        <div className="flex flex-row items-start w-full  mt-3 p-1 text-[10px] font-normal text-blue-500">
          <Link to={'/login'}>Already Have A Account?</Link>
        </div>

      </form>
    </div>
  )
}

export default Register
