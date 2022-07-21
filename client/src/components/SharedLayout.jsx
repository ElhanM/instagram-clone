import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useGlobalContext } from "./context";
import { useEffect } from "react";

const SharedLayout = () => {
  const { userDispatch, userInfo } = useGlobalContext();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    userDispatch(user);
  }, []);

  return (
    <>
      {userInfo && <Navbar />}
      <Outlet />
    </>
  );
};
export default SharedLayout;
