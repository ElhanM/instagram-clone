import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useGlobalContext } from "./context";
import { useEffect } from "react";

const SharedLayout = () => {
  const { userDispatch, userInfo } = useGlobalContext();
  useEffect(() => {
    // in order to check if user is logged in, we need to check if user variable has a value
    // so, we need to check the value of user on each render
    // that means user has to be declared in a useEffect hook
    // if we do that, then we can not use user in our component, because it is block scoped
    // so we use reducer
    const user = JSON.parse(localStorage.getItem("user"));
    userDispatch(user);
    console.log("SharedLayout useEffect");
  }, []);

  return (
    <>
      {userInfo && <Navbar />}
      <Outlet />
    </>
  );
};
export default SharedLayout;
