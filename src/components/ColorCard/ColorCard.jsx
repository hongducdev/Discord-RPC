import React from "react";
import { useDispatch } from "react-redux";
import { setColorPrimary } from "../../app/color/colorSlice";

const ColorCard = ({ name, value }) => {
  const dispatch = useDispatch();
  const handleChangeColor = (color) => {
    dispatch(setColorPrimary(color));
  };

  console.log("🚀 ~ ColorCard ~ value:", value);

  return (
    <div
      className="inline-flex items-center gap-2 border border-ctp-subtext1 px-4 py-2 rounded-lg cursor-pointer hover:bg-ctp-subtext1 hover:text-ctp-base hover:duration-300 hover:ease-in-out"
      onClick={() => handleChangeColor(value)}
    >
      <div className={`w-6 h-6 rounded-full bg-${value}`}></div>
      <span>{name}</span>
    </div>
  );
};

export default ColorCard;
