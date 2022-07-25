import { Button, FormControl, TextField, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context";
import axios from "axios";
import { useState } from "react";

const ExplorePage = () => {
  const {
    userDispatch,
    userInfo,
    allPosts,
    loading,
    updatePostsDispatch,
    likeURL,
    unlikeURL,
    commentURL,
    handleSubmit,
  } = useGlobalContext();
  const [explorePosts, setExplorePosts] = useState([]);
  const [addComment, setAddComment] = useState("");

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
      updatePostsDispatch(updatedPosts);
      const user = JSON.parse(localStorage.getItem("user"));
      setExplorePosts(
        updatedPosts.filter((post) => {
          return post.user._id !== user._id;
        })
      );
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
      updatePostsDispatch(updatedPosts);
      const user = JSON.parse(localStorage.getItem("user"));
      setExplorePosts(
        updatedPosts.filter((post) => {
          return post.user._id !== user._id;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    userDispatch(user);
    if (!user) {
      history("/login");
    }
    setExplorePosts(
      // ! don't display posts from accounts the user is following
      allPosts.filter((post) => {
        return post.user._id !== user._id;
      })
    );
  }, [allPosts]);
  return (
    <div className="explore-page">
      {loading ? (
        <h1>Loading...</h1>
      ) : allPosts === [] ? (
        <h1>No posts to display </h1>
      ) : (
        explorePosts
          .slice(0)
          .reverse()
          .map((post, index) => (
            <div className="explore-page__container">
              <div className="explore-page__container__header">
                <div className="explore-page__container__header__photo">
                  <Link to={`/profile/${post.user._id}`}>
                    <Avatar
                      alt={post.user.username}
                      src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
                      sx={{ width: "3rem", height: "3rem" }}
                    />
                  </Link>
                </div>
                <div className="explore-page__container__header__user">
                  <Link to={`/profile/${post.user._id}`}>
                    <Typography variant="h3" sx={{ fontSize: "2rem" }}>
                      {post.user.username}
                    </Typography>
                  </Link>
                </div>
              </div>
              <div className="explore-page__container__image">
                <Link to={`/profile/${post.user._id}/${post._id}`}>
                  <img
                    src={post.photo}
                    alt={post?.description || post?.title}
                  />
                </Link>
              </div>
              <div className="explore-page__container__footer">
                <div className="explore-page__container__footer__likes">
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
                <FormControl
                  component="form"
                  variant="standard"
                  sx={{
                    paddingBottom: "0.4em",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(post._id, e.target[0].value, allPosts);
                    e.target[0].value = "";
                  }}
                >
                  <TextField
                    variant="standard"
                    required
                    name="comment"
                    label="Add comment"
                    id="comment"
                    autoComplete="off"
                    sx={[
                      {
                        "& .MuiInput-underline:after": {
                          borderBottomColor: "#000",
                        },
                        "& label.Mui-focused": {
                          color: "#000",
                        },
                        "& .MuiOutlinedInput-root": {
                          "&.Mui-focused fieldset": {
                            borderColor: "#000",
                          },
                        },
                        width: "90%",
                        marginRight: "0.5em",
                      },
                    ]}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={[
                      {
                        "&:hover": {
                          backgroundColor: "#000",
                          color: "#fff",
                        },
                        mt: 3,
                        mb: 2,
                        color: "#000",
                        backgroundColor: "#fff",
                        borderColor: "#000",
                        border: "2px solid #000",
                        transition: "background-color 0.2s ease",
                        width: "3em",
                      },
                    ]}
                  >
                    Add
                  </Button>
                </FormControl>

                {post.comments.map((comment) => (
                  <Typography
                    variant="h1"
                    sx={{ fontSize: "1.2rem", paddingTop: "0.2em" }}
                  >
                    {comment.user.username}:{comment.text}
                  </Typography>
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default ExplorePage;
