import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { MemoAppProvider } from "./components/context";
import Loading from "./components/Loading";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MemoAppProvider>
    <App />
  </MemoAppProvider>
);
