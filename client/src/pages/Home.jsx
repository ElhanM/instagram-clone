import { FormControl, Input, InputLabel, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context";
import axios from "axios";
import { useState } from "react";

const likeURL = "http://localhost:5000/api/posts/like";
const unlikeURL = "http://localhost:5000/api/posts/unlike";

const Home = () => {
  const { userDispatch, userInfo, allPosts, loading, getPostsDispatch } =
    useGlobalContext();
  const [homePosts, setHomePosts] = useState([]);
  const history = useNavigate();
  const likeRequest = async (postId) => {
    try {
      const response = await axios.put(
        likeURL,
        { postId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const updatedPosts = allPosts.map((post) => {
        if (post._id === response.data.likePost._id) {
          return { ...post, likes: response.data.likePost.likes };
        } else {
          return post;
        }
      });
      getPostsDispatch(updatedPosts);
    } catch (error) {
      console.log(error);
    }
  };
  const unlikeRequest = async (postId) => {
    try {
      const response = await axios.put(
        unlikeURL,
        { postId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const updatedPosts = allPosts.map((post) => {
        if (post._id === response.data.unlikePost._id) {
          return { ...post, likes: response.data.unlikePost.likes };
        } else {
          return post;
        }
      });
      getPostsDispatch(updatedPosts);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    userDispatch(user);
    if (!user) {
      history("/login");
    }
    setHomePosts(
      // ! only display posts from accounts the user is following
      allPosts.filter((post) => {
        return post.user._id !== user._id;
      })
    );
    console.log("homePosts", homePosts);
    // having allPosts in the dependency array fixes async issues when changing state
  }, [allPosts]);
  return (
    <div className="home">
      {loading ? (
        <h1>Loading...</h1>
      ) : allPosts === [] ? (
        <h1>No allPosts to display </h1>
      ) : (
        homePosts
          // slice, for some reason, prevents allPosts from jumping around when liking/unliking them
          .slice(0)
          .reverse()
          .map((post, index) => (
            <div className="home__container">
              <div className="home__container__header">
                <div className="home__container__header__photo">
                  <Avatar
                    alt={post.user.username}
                    src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
                    sx={{ width: "3rem", height: "3rem" }}
                  />
                </div>
                <div className="home__container__header__user">
                  <Typography variant="h2" sx={{ fontSize: "2rem" }}>
                    {post.user.username}
                  </Typography>
                </div>
              </div>
              <div className="home__container__image">
                <img src={post.photo} alt={post.title} />
              </div>
              <div className="home__container__footer">
                <div className="home__container__footer__likes">
                  {post.likes.includes(userInfo._id) ? (
                    <FavoriteIcon
                      onClick={() => {
                        unlikeRequest(post._id);
                      }}
                      sx={[
                        {
                          "&:hover": {
                            cursor: "pointer",
                            scale: "1.2",
                          },
                          color: "red",
                        },
                      ]}
                    />
                  ) : (
                    <FavoriteBorderIcon
                      onClick={() => {
                        likeRequest(post._id);
                      }}
                      sx={[
                        {
                          "&:hover": {
                            cursor: "pointer",
                            scale: "1.2",
                          },
                        },
                      ]}
                    />
                  )}
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "1.2rem", marginLeft: "0.2em" }}
                  >
                    {post.likes.length === 1
                      ? `${post.likes.length} like`
                      : `${post.likes.length} likes`}
                  </Typography>
                </div>

                <Typography variant="h1" sx={{ fontSize: "1.7rem" }}>
                  {post.title}
                </Typography>
                <Typography variant="h1" sx={{ fontSize: "1.4rem" }}>
                  {post.description}
                </Typography>
                <FormControl variant="standard">
                  <InputLabel htmlFor="component-simple">
                    Add comment
                  </InputLabel>
                  <Input id="component-simple" />
                </FormControl>
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default Home;
