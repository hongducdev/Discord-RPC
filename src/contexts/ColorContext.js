import React, { createContext, useState } from "react";

export const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
  const [color, setColor] = useState("ctp-flamingo");

  const changeColor = (newColor) => {
    setColor(newColor);
  };

  return (
    <ColorContext.Provider value={{ color, changeColor }}>
      {children}
    </ColorContext.Provider>
  );
};
