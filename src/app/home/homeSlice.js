import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogged: false,
  dataInput: null,
};

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setIsLogged: (state, action) => {
      state.isLogged = action.payload;
    },
    setDataInput: (state, action) => {
      state.dataInput = action.payload;
    },
  },
});

export const { setIsLogged, setDataInput } = homeSlice.actions;

export default homeSlice.reducer;
