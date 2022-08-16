import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context";
import axios from "axios";
import { useState } from "react";
import Posts from "../components/ShowPosts";
import { Typography } from "@mui/material";

const Home = () => {
  const {
    userDispatch,
    allPosts,
    loading,
    updatePostsDispatch,
    likeURL,
    unlikeURL,
    setValue,
  } = useGlobalContext();
  const [homePosts, setHomePosts] = useState([]);
  const [editCommentMode, setEditCommentMode] = useState(false);
  const [initialRender, setInitialRender] = useState(true);

  const [inputs, setInputs] = useState({
    editComment: "",
    editCommentId: "",
    editCommentPostId: "",
  });
  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };
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
      const updatedPosts = allPosts?.map((post) => {
        if (post?._id === response?.data?.likePost?._id) {
          return { ...post, likes: response?.data?.likePost?.likes };
        } else {
          return post;
        }
      });
      updatePostsDispatch(updatedPosts);
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
      const updatedPosts = allPosts?.map((post) => {
        if (post._id === response?.data?.unlikePost?._id) {
          return { ...post, likes: response?.data?.unlikePost?.likes };
        } else {
          return post;
        }
      });
      updatePostsDispatch(updatedPosts);
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
    if (initialRender) {
      setHomePosts(
        allPosts?.filter((post) => {
          return (
            // return post if post?.user?._id !== user?._id and if initial render is true make !post?.user?.followers?.includes(JSON.parse(localStorage.getItem("user"))._id) second condition
            post?.user?._id === JSON.parse(localStorage.getItem("user"))._id ||
            !initialRender ||
            post?.user?.followers?.includes(
              JSON.parse(localStorage.getItem("user"))._id
            )
          );
        })
      );
    } else {
      // fixing bug where posts from people the user was following showed up in explore page
      const tempAllPosts = allPosts?.filter((post) => {
        return (
          post?.user?._id === JSON.parse(localStorage.getItem("user"))._id ||
          !initialRender ||
          post?.user?.followers?.includes(
            JSON.parse(localStorage.getItem("user"))._id
          )
        );
      });
      // if homePosts does not contain post from tempAllPosts then remove it
      const temphomePosts = tempAllPosts?.filter((post) => {
        return homePosts.find((explorePost) => post?._id === explorePost?._id);
      });
      setHomePosts(temphomePosts);
    }
  }, [allPosts]);
  useEffect(() => {
    console.log("initialrender", initialRender);
    if (homePosts.length > 0) {
      setInitialRender(false);
    }
  }, [homePosts, initialRender]);

  useEffect(() => {
    setValue();
  }, []);

  return (
    <div className="main-page">
      {loading ? (
        <h1>Loading...</h1>
      ) : allPosts === [] ? (
        <h1>No allPosts to display </h1>
      ) : (
        homePosts
          // slice, for some reason, prevents allPosts from jumping around when liking/unliking them
          ?.slice(0)
          .reverse()
          .map((post, index) => (
            <Posts
              key={post?._id}
              post={post}
              unlikeRequest={unlikeRequest}
              likeRequest={likeRequest}
              editCommentMode={editCommentMode}
              inputs={inputs}
              setInputs={setInputs}
              setEditCommentMode={setEditCommentMode}
              handleChange={handleChange}
            />
          ))
      )}
      <Typography
        variant="h6"
        noWrap
        component="a"
        sx={{
          mr: 2,
          display: "flex",
          fontFamily: "monospace",
          fontWeight: 700,
          color: "inherit",
          textDecoration: "none",
          margin: "1em auto",
          padding: "0 1em",
          justifyContent: "center",
          // enable text wrap
          whiteSpace: "normal",
          wordWrap: "break-word",
        }}
      >
        To find more posts navigate to the explore page using the navbar
      </Typography>
    </div>
  );
};

export default Home;
