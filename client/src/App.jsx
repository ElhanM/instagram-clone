import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExplorePage from "./pages/ExplorePage";
import SharedLayout from "./components/SharedLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Error from "./pages/Error";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "./components/context";
import Post from "./pages/Post";
import Cookies from "universal-cookie";
import React from "react";

const Routing = () => {
  const cookies = new Cookies();
  const { userDispatch } = useGlobalContext();
  const history = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    userDispatch(user);
    if (
      localStorage.getItem("cookieExpire") <
      JSON.stringify(new Date().setDate(new Date().getDate()))
    ) {
      cookies.remove("authToken", { path: "/" });
      localStorage.removeItem("user");
      localStorage.removeItem("cookieExpire");
      userDispatch(null);
      history("/login");
    }
  }, []);
  return (
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        <Route index element={<Home />} />
        <Route path="profile/:userId" element={<Profile />}>
          <Route path=":postId" element={<Post />} />
        </Route>
        <Route path="create-post" element={<CreatePost />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<Error />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  );
}

export const MemoApp = React.memo(App);
