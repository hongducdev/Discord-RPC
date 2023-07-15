import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  colorPrimary: "ctp-flamingo",
};

export const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {
    setColorPrimary: (state, action) => {
      state.colorPrimary = action.payload;
    },
  },
});

export const { setColorPrimary } = colorSlice.actions;

export default colorSlice.reducer;
