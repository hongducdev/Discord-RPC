import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogged: false,
  applicationId: null,
  sessionId: null,
  dataInput: null,
  isOpenModalSelectSession: false,
};

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setIsLogged: (state, action) => {
      state.isLogged = action.payload;
    },
    setApplication: (state, action) => {
      state.applicationId = action.payload;
    },
    setDataInput: (state, action) => {
      state.dataInput = action.payload;
    },
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    },
    setShowModalSelectSession: (state, action) => {
      state.isOpenModalSelectSession = action.payload;
    },
  },
});

export const { setIsLogged, setDataInput, setSessionId, setShowModalSelectSession, setApplication } = homeSlice.actions;

export default homeSlice.reducer;
