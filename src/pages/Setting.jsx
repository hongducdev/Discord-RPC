import icons from "../utils/icons";
import useDarkMode from "../hooks/useDarkMode";
import { colors } from "../utils/constants";
import React, { useContext } from "react";
import {ColorContext} from "../contexts/ColorContext";

const { RiSunLine, RiMoonClearLine } = icons;

const Setting = () => {
  const [darkMode, setDarkMode] = useDarkMode();
  const { color, changeColor } = useContext(ColorContext);

  return (
    <div className="w-full bg-ctp-surface0 p-5 rounded-xl">
      <h2 className={`text-3xl font-bold text-${color}`}>Setting</h2>
      <div className="w-full h-[2px] bg-ctp-subtext0 my-2 rounded-xl"></div>
      <div className="">
        <span className="text-xl text-semibold">Mode</span>
        <div className="flex items-center gap-2 mt-2">
          <div
            className="inline-flex items-center gap-2 border border-ctp-subtext1 px-4 py-2 rounded-lg cursor-pointer hover:bg-ctp-subtext1 hover:text-ctp-base hover:duration-300 hover:ease-in-out"
            onClick={() => setDarkMode(!darkMode)}
          >
            <RiSunLine className="text-xl" />
            <span>Light mode</span>
          </div>
          <div
            className="inline-flex items-center gap-2 border border-ctp-subtext1 px-4 py-2 rounded-lg cursor-pointer hover:bg-ctp-subtext1 hover:text-ctp-base hover:duration-300 hover:ease-in-out"
            onClick={() => setDarkMode(!darkMode)}
          >
            <RiMoonClearLine className="text-xl" />
            <span>Night mode</span>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <span className="text-xl text-semibold">Color</span>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {colors.map((color) => (
            <div
              key={color.id}
              className="inline-flex items-center gap-2 border border-ctp-subtext1 px-4 py-2 rounded-lg cursor-pointer hover:bg-ctp-subtext1 hover:text-ctp-base hover:duration-300 hover:ease-in-out"
              onClick={() => changeColor(color.value)}
            >
              <div className={`w-6 h-6 rounded-full bg-${color.value}`}></div>
              <span>{color.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Setting;
