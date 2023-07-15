import React from "react";
import NavBar from "../components/NavBar/NavBar";
import { Outlet } from "react-router-dom";
import TitleBar from "../components/TittleBar/TitleBar";

const MainLayout = () => {
  return (
    <div className="bg-gradient-to-br from-ctp-base to-ctp-crust text-ctp-text w-screen min-h-screen">
      <TitleBar />
      <div className="w-full h-20"></div>
      <div className="max-w-[1200px] w-full mx-auto py-4 px-2 flex">
        <NavBar />
        <div className="max-w-[1136px] ml-5 flex-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
