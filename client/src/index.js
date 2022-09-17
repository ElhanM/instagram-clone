import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { MemoApp } from "./App";
import { MemoAppProvider } from "./components/context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MemoAppProvider>
    <MemoApp />
  </MemoAppProvider>
);
