import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar/NavBar";
import { Outlet } from "react-router-dom";
import TitleBar from "../components/TittleBar/TitleBar";
import SelectSessionId from "../components/Modals/SelectSessionId";
import { useSelector } from "react-redux";
import { ContextMenu } from "../components/ContextMenu";

const MainLayout = () => {
  const { isOpenModalSelectSession } = useSelector((state) => state.home);
  const [position, setPosition] = useState({ x: 0, y: 0, show: false });
  const [content, setContent] = useState('');

  function getSelectionText() {
    const activeElement = document.activeElement;
    const elementTagName = activeElement ? activeElement.tagName.toLowerCase() : null;
    if(
      elementTagName === 'textarea' || 
      (elementTagName === 'input' && /^(?:text|search|password|tel|url)$/i.test(activeElement.type))
    ) {
      return activeElement.value.slice(activeElement.selectionStart, activeElement.selectionEnd);
    }
  }

  // check select
  useEffect(() => {
    document.onmouseup = document.onkeyup = document.onselectionchange = function() {
      const inputContent = getSelectionText();
      if(typeof inputContent != "undefined") {
        setContent(inputContent)
      }
      
      
    }
  }, [])

  // remove menu
  useEffect(() => {
    const handleClick = () => setPosition({ x: position.x, y: position.y, show: false });
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [position]);


  return (
    <div className="bg-gradient-to-br from-ctp-base to-ctp-crust text-ctp-text w-screen min-h-screen" onContextMenu={(e) => {
      e.preventDefault()
      const activeElement = document.activeElement;
      if (
        activeElement.tagName.toLowerCase() === 'textarea' || (
          activeElement.tagName.toLowerCase() === 'input' && /^(?:text|search|password|tel|url)$/i.test(activeElement.type)
        )) {
        setPosition({ x: e.pageX, y: e.pageY, show: true })
        console.log(e.pageX, e.pageY)
      } else {
        setPosition({ x: position.x, y: position.y, show: false })
      }


    }}  >
      <TitleBar />
      <div className="w-full h-20"></div>
      <div className="relative max-w-[1200px] w-full mx-auto py-4 px-2 flex" >
        {position.show ? (<>
         <ContextMenu position={position} content={content}/>
        </>) : (<></>)}
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
