import SearchAcc from "../Auth/SearchAcc";
import { RootState } from "../../Redux/Store";
import { useSelector } from "react-redux";

const Header = () => {

  const { user } = useSelector((state: RootState) => state.user)


  return (
    <div className="flex bg-gray-500 flex-col justify-between w-full items-center ">
      <div className="flex bg-gray-500 text-white flex-row justify-between w-full items-center p-5">
        <h1 className="text-[15px]  font-bold">ChatApp</h1>
        <h1 className="text-[15px] font-bold" ><i className="fa-solid fa-user me-2"></i> {user?.email && user?.email?.trim().substring(0, (user?.email.indexOf('@')))}</h1>
      </div>
      <SearchAcc />
    </div>
  )
}

export default Header
