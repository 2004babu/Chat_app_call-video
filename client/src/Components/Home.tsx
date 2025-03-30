
import Header from "./Static/Header";
import React, { ReactNode } from "react";
import UserChat from "./Chat/UserChat";

interface LayoutProps {
  children: ReactNode;
  sideContent?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, sideContent=false }) => {
  // const UserState = useSelector((state: RootState) => state.user);
  // console.log(UserState);

  return (
    <div className="h-screen w-screen flex flex-row overflow-hidden">
      {/* Sidebar */}
      {sideContent ? <div className="h-full max-[700px]:hidden  min-[700px]:w-80 w-full flex flex-col">
        <Header />
        {children}
      </div> :
        <div className="h-full   min-[700px]:w-80 w-full flex flex-col">
          <Header />
          {children}
        </div>
      }
      {/* Main Content */}
      <div className="h-full flex-grow flex overflow-hidden">
        {sideContent ? (
          <UserChat/>
        ) : (
          <div className="w-full h-full text-[20px] text-gray-300 font-bold max-[700px]:hidden flex flex-col justify-center items-center bg-gray-700">
            Start ConverSation 
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
