import { FormControl, Input, InputLabel, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context";
import axios from "axios";
import { useState } from "react";

const URL = "http://localhost:5000/api/posts";

const ExplorePage = () => {
  const { userDispatch, userInfo } = useGlobalContext();
  const [posts, setPosts] = useState({});
  const [loading, setLoading] = useState(true);
  const history = useNavigate();
  const postRequest = async () => {
    try {
      const response = await axios(URL, {
        headers: {
          "Content-Type": "application/json",
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
    <div className="explore-page">
      {loading ? (
        <h1>Loading...</h1>
      ) : posts === [] ? (
        <h1>No posts to display </h1>
      ) : (
        posts.reverse().map((post) => (
          <div className="explore-page__container">
            <div className="explore-page__container__header">
              <div className="explore-page__container__header__photo">
                <Avatar
                  alt={post.user.username}
                  src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
                  sx={{ width: "3rem", height: "3rem" }}
                />
              </div>
              <div className="explore-page__container__header__user">
                <Typography variant="h2" sx={{ fontSize: "2rem" }}>
                  {post.user.username}
                </Typography>
              </div>
            </div>
            <div className="explore-page__container__image">
              <img src={post.photo} alt={post.title} />
            </div>
            <div className="explore-page__container__footer">
              <FavoriteBorderIcon />
              <FavoriteIcon sx={{ color: "red" }} />
              <Typography variant="h1" sx={{ fontSize: "1.7rem" }}>
                {post.title}
              </Typography>
              <Typography variant="h1" sx={{ fontSize: "1.4rem" }}>
                {post.description}
              </Typography>
              <FormControl variant="standard">
                <InputLabel htmlFor="component-simple">Add comment</InputLabel>
                <Input id="component-simple" />
              </FormControl>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExplorePage;
