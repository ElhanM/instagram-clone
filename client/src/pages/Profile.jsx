import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context";
import axios from "axios";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { userId } = useParams();
  console.log(userId);
  const { userDispatch, allPosts, loading, authURL } = useGlobalContext();
  const history = useNavigate();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);
  const axiosGetUser = async () => {
    try {
      // dispatch({ type: "LOADING" });
      const response = await axios(`${authURL}/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const {
        data: { user },
      } = response;
      setUser(user);
      // dispatch({ type: "GET_POSTS", payload: posts });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    axiosGetUser();
    userDispatch(user);
    setPosts(
      allPosts?.filter((post) => {
        return post?.user?._id === userId;
      })
    );
    if (!user) {
      history("/login");
    }
  }, [allPosts, userId]);
  useEffect(() => {
    console.log("user", user);
  }, [user]);

  return (
    <>
      <div className="profile">
        {loading ? (
          <h1>Loading...</h1>
        ) : posts === [] ? (
          <h1>No posts to display </h1>
        ) : (
          <div className="profile-container">
            <div className="profile-container__header">
              <div className="profile-container__header__profile-photo">
                <Avatar
                  alt={user[0]?.username}
                  src={
                    posts[0]?.user?.profilePhoto ||
                    "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg"
                  }
                  sx={{ width: "13rem", height: "13rem" }}
                />
              </div>
              <div className="profile-container__header__user-info">
                <div className="profile-container__header__user-info__name">
                  <Typography variant="h5" sx={{ fontSize: "2.6rem" }}>
                    {user[0]?.username}
                  </Typography>
                </div>
                <div className="profile-container__header__user-info__stats">
                  <Typography variant="p" sx={{ marginRight: "0.8em" }}>
                    {posts?.length} posts
                  </Typography>
                  <Typography variant="p" sx={{ marginRight: "0.8em" }}>
                    10 followers
                  </Typography>
                  <Typography variant="p" sx={{ marginRight: "0.8em" }}>
                    12 following
                  </Typography>
                </div>
              </div>
            </div>
            <div className="profile-container__hr"></div>
            <div className="profile-container__posts">
              {posts
                ?.slice(0)
                .reverse()
                .map((post) => (
                  <Link to={`/profile/${post?.user?._id}/${post?._id}`}>
                    <img
                      src={post?.photo}
                      alt={post?.description || post?.title}
                    />
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
      <Outlet />
    </>
  );
};

export default Profile;
