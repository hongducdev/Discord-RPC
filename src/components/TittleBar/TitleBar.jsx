import React from "react";

const TitleBar = () => {
  return (
    <div className="max-w-screen bg-ctp-crust text-ctp-text py-3 px-5 flex items-center justify-between fixed top-0 w-full">
      <div className="">NyanRPC</div>
      <div className="flex items-center gap-5">
        <span
          className="w-5 h-1 bg-ctp-surface2 rounded-lg cursor-pointer hover:bg-ctp-blue hover:duration-300 hover:ease-in-out"
          onClick={() => {
            window.titleBar.minimize();
          }}
        ></span>
        <span className="w-5 h-5 bg-ctp-surface2 rounded-md cursor-pointer border-2 border-transparent hover:bg-transparent hover:border-ctp-green hover:duration-300 hover:ease-in-out"
        onClick={() => {
          window.titleBar.max();
        }}
        ></span>
        <span className="w-5 h-1 bg-ctp-surface2 -rotate-45 rounded-lg cursor-pointer hover:bg-ctp-red hover:duration-300 hover:ease-in-out relative after:absolute after:w-5 after:h-1 after:bg-ctp-surface2 after:rotate-90 after:rounded-lg hover:after:bg-ctp-red" onClick={() => {window.titleBar.close()}}></span>
      </div>
    </div>
  );
};

export default TitleBar;
