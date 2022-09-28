import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { MemoApp } from "./App";
import { MemoAppProvider } from "./components/context";
import { QueryClient, QueryClientProvider } from "react-query";
import Loading from "./components/Loading";

const queryClient = new QueryClient({
  // defaultOptions: {
  //   queries: {
  //     suspense: false,
  //   },
  // },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MemoAppProvider>
    <QueryClientProvider client={queryClient}>
      <React.Suspense fallback={<Loading />}>
        <MemoApp />
      </React.Suspense>
    </QueryClientProvider>
  </MemoAppProvider>
);
