import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useGlobalContext } from "./context";
import { useEffect } from "react";

const SharedLayout = () => {
  const { userInfo } = useGlobalContext();

  return (
    <>
      {userInfo && <Navbar />}
      <Outlet />
    </>
  );
};
export default SharedLayout;
