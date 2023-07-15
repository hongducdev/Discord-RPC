import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ColorProvider } from "./contexts/ColorContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ColorProvider>
      <BrowserRouter>
        <App />
        <ToastContainer position="bottom-right" theme="colored" />
      </BrowserRouter>
    </ColorProvider>
  </React.StrictMode>
);
