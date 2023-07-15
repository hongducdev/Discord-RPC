import React, { useState } from "react";
import { avatarURL } from "../../utils/functions";

const ProfileCard = ({ payload, currentUser }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const handleMouseEnter = (index) => {
    setActiveTooltip(index);
  };

  const handleMouseLeave = () => {
    setActiveTooltip(null);
  };

  return (
    <div className="flex-4 bg-ctp-surface0 rounded-xl">
      <div className="w-full bg-ctp-flamingo h-[120px] rounded-t-xl"></div>
      <img
        src={avatarURL(currentUser) || "https://source.unsplash.com/random"}
        alt="Avatar"
        className="w-28 h-28 object-cover rounded-full border-4 border-ctp-surface0 -mt-10 ml-3"
      />
      <div className="bg-gradient-to-br from-ctp-base to-ctp-crust m-3 p-3 rounded-lg flex flex-col">
        <span className="text-2xl font-semibold">
          {currentUser?.global_name || "Global Name"}
        </span>
        <small className="mt-1">{currentUser?.username || "Username"}</small>
        <div className="w-full h-[1px] bg-ctp-subtext0 rounded-full my-3"></div>
        <span className="uppercase font-semibold text-sm">PLAYING A GAME</span>
        <div className="mt-5 flex gap-8 items-center">
          <div className="relative">
            <img
              src={
                payload.largeImageKey || "https://source.unsplash.com/random"
              }
              alt="big_image"
              className="w-28 h-28 object-cover rounded-lg cursor-pointer"
              onMouseEnter={() => handleMouseEnter(0)}
              onMouseLeave={handleMouseLeave}
            />
            {activeTooltip === 0 && (
              <div className="absolute bg-ctp-surface0 text-white text-sm py-1 px-2 rounded-lg bottom-full right-0 mb-2 mr-1">
                {payload.largeImageText || "Large image"}
              </div>
            )}

            <img
              src={
                payload.smallImageKey || "https://source.unsplash.com/random"
              }
              alt="small_image"
              className="w-10 h-10 object-cover rounded-full absolute bottom-0 right-0 -mb-1 -mr-1 border-2 border-ctp-surface0 cursor-pointer"
              onMouseEnter={() => handleMouseEnter(1)}
              onMouseLeave={handleMouseLeave}
            />
            {activeTooltip === 1 && (
              <div className="absolute bg-ctp-surface0 text-white text-sm py-1 px-2 rounded-lg bottom-9 right-0 mb-2 mr-1">
                {payload.smallImageText || "Small image"}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg">Visual Studio Code</span>
            <span className="text-sm">
              {payload.details || "Editing in index.js"}
            </span>
            <span className="text-sm">
              {payload.state || "Workspace: NyanRPC"}{" "}
              {payload.partySize > 0 &&
                `(${payload.partySize} of ${payload.partyMax})`}
            </span>
            <span className="text-sm">
              <span className="">12:00:00</span> elapsed
            </span>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <div className="w-full rounded-lg bg-ctp-base py-2 px-3 text-center hover:bg-ctp-mantle cursor-pointer hover:duration-300 hover:ease-in-out">
            {payload.buttons[0].label || "Button 1"}
          </div>
          <div className="w-full rounded-lg bg-ctp-base py-2 px-3 text-center hover:bg-ctp-mantle cursor-pointer hover:duration-300 hover:ease-in-out">
            {payload.buttons[1].label || "Button 2"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
