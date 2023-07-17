import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  colorPrimary: "ctp-flamingo",
  mode: "light",
};

export const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {
    setColorPrimary: (state, action) => {
      state.colorPrimary = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
      const element = window.document.documentElement;
      if (state.mode === "dark") {
        element.classList.add("dark");
      } else {
        element.classList.remove("dark");
      }
    },
  },
});

export const { setColorPrimary, setMode } = colorSlice.actions;

export default colorSlice.reducer;
