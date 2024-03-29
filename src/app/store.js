import { configureStore } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import homeReducer from "./home/homeSlice";
import colorSlice from "./color/colorSlice";

export const store = configureStore({
  reducer: {
    home: homeReducer,
    color: colorSlice,
  },
  middleware: [thunkMiddleware],
});
