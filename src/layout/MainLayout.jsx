import React from "react";
import NavBar from "../components/NavBar/NavBar";
import { Outlet } from "react-router-dom";
import TitleBar from "../components/TittleBar/TitleBar";
import SelectSessionId from "../components/Modals/SelectSessionId";
import { useSelector } from "react-redux";

const MainLayout = () => {
  const { isOpenModalSelectSession } = useSelector((state) => state.home);

  return (
    <div className="bg-gradient-to-br from-ctp-base to-ctp-crust text-ctp-text w-screen min-h-screen relative">
      <TitleBar />
      <div className="w-full h-20"></div>
      <div className="max-w-[1200px] w-full mx-auto py-4 px-2 flex">
        <NavBar />
        <div className="max-w-[1136px] ml-5 flex-auto">
          <Outlet />
        </div>
      </div>
      {isOpenModalSelectSession && (
        <div className="absolute bg-ctp-crust inset-0 flex items-center justify-center bg-opacity-80">
          <div className="w-[500px]">
            <SelectSessionId />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
