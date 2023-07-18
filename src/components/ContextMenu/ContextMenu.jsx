import React from "react";
import icons from "../../utils/icons";

const { RiFileCopyLine, RiClipboardLine } = icons;

const ContextMenu = () => {
  return (
    <div className="inline-flex flex-col bg-ctp-surface0 py-3 rounded-lg">
      <div className="flex items-center gap-3 text-lg cursor-pointer hover:bg-ctp-crust px-5 py-2"
      onClick={() => {
        
      }}
      >
        <span className="">
          <RiFileCopyLine />
        </span>
        <span className="">Copy</span>
      </div>
      <div className="flex items-center gap-3 text-lg cursor-pointer hover:bg-ctp-crust px-5 py-2">
        <span className="">
          <RiClipboardLine />
        </span>
        <span className="">Paste</span>
      </div>
    </div>
  );
};

export default ContextMenu;
