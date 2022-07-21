import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context";
import axios from "axios";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const URL = "http://localhost:5000/api/posts/my-posts";

const Profile = () => {
  const { userDispatch, userInfo } = useGlobalContext();
  const history = useNavigate();
  const [posts, setPosts] = useState({});
  const [loading, setLoading] = useState(true);
  const postRequest = async () => {
    try {
      const response = await axios(URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const {
        data: { posts },
      } = response;
      setPosts(posts);
      console.log(posts);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    userDispatch(user);
    postRequest();
    if (!user) {
      history("/login");
    }
  }, []);
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
                  alt={posts[0].user.username}
                  src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
                  sx={{ width: "13rem", height: "13rem" }}
                />
              </div>
              <div className="profile-container__header__user-info">
                <div className="profile-container__header__user-info__name">
                  <Typography variant="h5" sx={{ fontSize: "2.6rem" }}>
                    {posts[0].user.username}
                  </Typography>
                </div>
                <div className="profile-container__header__user-info__stats">
                  <Typography variant="p" sx={{ marginRight: "0.8em" }}>
                    {posts.length} posts
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
              {posts.map((post) => (
                <img src={post.photo} alt={post.title} />
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
