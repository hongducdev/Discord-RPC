import React from "react";
import ColorCard from "./ColorCard";
import { colors } from "../../utils/constants";

const ColorSelect = () => {
  return (
    <div className="">
      <span className="text-xl text-semibold">Color</span>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {colors.map((color) => (
          <ColorCard key={color.id} name={color.name} value={color.value} />
        ))}
      </div>
    </div>
  );
};

export default ColorSelect;
