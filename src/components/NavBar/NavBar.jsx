import React from "react";
import { menu } from "../../utils/constants";
import icons from "../../utils/icons";
import { NavLink } from "react-router-dom";

const { RiDiscordFill } = icons;

const notActiveClasses =
  "w-16 h-16 flex items-center justify-center text-2xl cursor-pointer hover:bg-ctp-surface1 hover:text-ctp-flamingo rounded-xl duration-200 ease-in-out";

const activeClasses =
  "w-16 h-16 flex items-center justify-center text-2xl cursor-pointer bg-ctp-surface1 text-ctp-flamingo rounded-xl duration-200 ease-in-out";

const NavBar = () => {
  return (
    <div className="max-w-16">
      <div className="w-16 h-16 bg-ctp-surface0 flex items-center justify-center rounded-xl">
        <RiDiscordFill className="text-4xl text-ctp-flamingo" />
      </div>
      <div className="w-16 bg-ctp-surface0 rounded-xl mt-5">
        {menu.map((item) => (
          <NavLink
            key={item.id}
            className={({ isActive }) =>
              isActive ? activeClasses : notActiveClasses
            }
            to={item.path}
          >
            {item.icon}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default NavBar;
