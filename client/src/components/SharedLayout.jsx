import { Outlet } from "react-router-dom";
import { useGlobalContext } from "./context";
import { useEffect } from "react";
import React, { Suspense, lazy } from "react";

const Navbar = lazy(() => import("./Navbar"));

const SharedLayout = () => {
  const { userDispatch, userInfo } = useGlobalContext();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    userDispatch(user);
  }, []);

  return (
    <>
      {userInfo && (
        // this way content loads faster
        <Suspense>
          <Navbar />
        </Suspense>
      )}
      <Outlet />
    </>
  );
};
export default SharedLayout;
