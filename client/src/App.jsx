import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExplorePage from "./pages/ExplorePage";
import SharedLayout from "./components/SharedLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import CreatePost from "./pages/CreatePost";
import Error from "./pages/Error";
import Reset from "./pages/Reset";
import NewPassword from "./pages/NewPassword";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "./components/context";

const Routing = () => {
  const { userDispatch, userInfo } = useGlobalContext();
  const history = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    userDispatch(user);
    console.log("app.jsx useEffect");
    if (!user) {
      console.log("nema");
      history("/login");
    }
  }, []);
  return (
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        <Route index element={<Home />} />
        {/* add redirects to all routes */}
        <Route path="profile" element={<Profile />} />
        <Route path="profile/:userid" element={<UserProfile />} />
        <Route path="create-post" element={<CreatePost />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="reset" element={<Reset />} />
        <Route path="reset/:token" element={<NewPassword />} />
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

export default App;
