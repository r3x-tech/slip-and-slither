import React from "react";
import { MdLeaderboard } from "react-icons/md";
import { TbMoodEdit } from "react-icons/tb";
// import { LoginComponent } from './LoginComponent';
import { Leaderboard } from "./Leaderboard";
import { Customize } from "./Customize";

interface HeaderProps {
  onConnect: () => void;
  authStatus: string;
}

const Header: React.FC<HeaderProps> = ({ onConnect, authStatus }) => {
  return (
    <header className="w-full flex justify-center items-end min-h-10 mt-0 mb-40">
      <div className="w-full max-w-[360px] flex justify-between items-center">
        {/* <div className="flex-2 flex justify-start">
          <LoginComponent />
        </div> */}
        <div className="flex-1 flex justify-center">
          <div className="relative inline-block text-left">
            <div>
              <span className="cursor-pointer">
                <MdLeaderboard size="1.75rem" color="white" />
              </span>
            </div>
            <div className="origin-top-right absolute right-0 mt-2 w-[365px] rounded-none shadow-lg bg-black border-2 border-white">
              <div className="py-3 px-5 relative">
                <button className="absolute top-1 right-1 text-xs font-semibold text-gray-400 hover:text-gray-200 transition duration-150 ease-in-out">
                  X
                </button>
                <Leaderboard />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="relative inline-block text-left">
            <div>
              <span className="cursor-pointer">
                <TbMoodEdit size="1.75rem" color="white" />
              </span>
            </div>
            <div className="origin-top-right absolute right-0 mt-2 w-[365px] rounded-none shadow-lg bg-black border-2 border-white">
              <div className="py-3 px-5 relative">
                <button className="absolute top-1 right-1 text-xs font-semibold text-gray-400 hover:text-gray-200 transition duration-150 ease-in-out">
                  X
                </button>
                <Customize />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
