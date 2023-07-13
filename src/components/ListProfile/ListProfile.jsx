import React from "react";
import Profile from "./Profile/Profile";
import icons from "../../utils/icons";

const { RiAddFill, RiDeleteBinLine, RiSaveLine } = icons;

const ListProfile = () => {
  return (
    <div className="w-full bg-ctp-surface0 h-16 p-3 rounded-xl flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Profile />
        <Profile />
        <Profile />
        <Profile />
        <Profile />
        <div className="h-12 w-12 rounded-full bg-ctp-teal flex items-center justify-center text-2xl text-ctp-base cursor-pointer">
          <RiAddFill />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-12 w-12 rounded-full bg-ctp-red flex items-center justify-center text-2xl text-ctp-base cursor-pointer">
          <RiDeleteBinLine />
        </div>
        <div className="h-12 w-12 rounded-full bg-ctp-green flex items-center justify-center text-2xl text-ctp-base cursor-pointer">
          <RiSaveLine />
        </div>
      </div>
    </div>
  );
};

export default ListProfile;
