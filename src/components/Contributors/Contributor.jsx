import React from "react";
import icons from "../../utils/icons";

const { RiGithubFill } = icons;

const Contributor = ({ avatar, name, contributor, github }) => {
  return (
    <div className="flex items-center relative">
      <img
        src={avatar}
        alt="avatar"
        className="w-[200px] h-[200px] rounded-full object-cover border-4 border-ctp-flamingo z-10"
      />
      <div className="h-[170px] w-full bg-ctp-flamingo absolute rounded-xl text-ctp-base p-3 pl-[250px] flex gap-3 flex-col justify-center">
        <div className="flex flex-col">
          <span className="text-2xl font-bold">{name}</span>
          <span className="text-ctp-surface0">{contributor}</span>
        </div>
        <span className="text-ctp-surface0 flex items-center gap-2">
          <RiGithubFill className="inline-block text-2xl" />
          <a href={github} title={name}>
            {name}
          </a>
        </span>
      </div>
    </div>
  );
};

export default Contributor;
