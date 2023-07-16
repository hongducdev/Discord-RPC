import React from "react";
import Contributor from "../components/Contributors/Contributor";
import { useSelector } from "react-redux";

const About = () => {
  const { colorPrimary } = useSelector((state) => state.color);

  return (
    <div className="w-full bg-ctp-surface0 p-5 rounded-xl">
      <h2 className={`text-3xl font-bold text-${colorPrimary}`}>About</h2>
      <div className="w-full h-[2px] bg-ctp-subtext0 my-2 rounded-xl"></div>

      <div className="flex flex-col gap-3">
        <Contributor
          avatar="https://avatars.githubusercontent.com/u/73995275?v=4"
          name="hongduccodedao"
          contributor="Front-End Developer"
          github="https://github.com/hongduccodedao"
        />
        <Contributor
          avatar="https://avatars.githubusercontent.com/u/71698422?v=4"
          name="Elysia"
          contributor="Back-End Developer"
          github="https://github.com/aiko-chan-ai"
        />
      </div>
    </div>
  );
};

export default About;
