import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context";
import axios from "axios";
import { useState } from "react";
import Posts from "../components/ShowPosts";
import { Typography } from "@mui/material";
import Cookies from "universal-cookie";

const ExplorePage = () => {
  const {
    userDispatch,
    allPosts,
    loading,
    updatePostsDispatch,
    likeURL,
    unlikeURL,
    setValue,
    explorePosts,
    setExplorePosts,
  } = useGlobalContext();
  const cookies = new Cookies();
  const [editCommentMode, setEditCommentMode] = useState(false);
  const [initialRender, setInitialRender] = useState(true);

  const [inputs, setInputs] = useState({
    title: "",
    description: "",
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
            Authorization: `Bearer ${cookies.get("authToken")}`,
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
            Authorization: `Bearer ${cookies.get("authToken")}`,
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
    userDispatch(user);
    if (!user) {
      history("/login");
    }
    if (initialRender) {
      const tempExplorePosts = allPosts?.filter((post) => {
        return (
          // return post if post?.user?._id !== user?._id and if initial render is true make !post?.user?.followers?.includes(JSON.parse(localStorage.getItem("user"))._id) second condition
          post?.user?._id !== JSON.parse(localStorage.getItem("user"))._id &&
          (!initialRender ||
            !post?.user?.followers?.includes(
              JSON.parse(localStorage.getItem("user"))._id
            ))
        );
      });
      if (tempExplorePosts !== explorePosts) {
        setExplorePosts(tempExplorePosts);
      }
    } else {
      // fixing bug where posts from people the user was following showed up in explore page
      const tempAllPosts = allPosts?.filter((post) => {
        return (
          post?.user?._id !== JSON.parse(localStorage.getItem("user"))._id &&
          (!initialRender ||
            !post?.user?.followers?.includes(
              JSON.parse(localStorage.getItem("user"))._id
            ))
        );
      });
      // if explorePosts does not contain post from tempHomePosts then remove it
      const tempExplorePosts = tempAllPosts?.filter((post) => {
        return explorePosts.find(
          (explorePost) => post?._id === explorePost?._id
        );
      });
      setExplorePosts(tempExplorePosts);
    }
  }, [allPosts]);

  useEffect(() => {
    if (explorePosts.length > 0) {
      setInitialRender(false);
    }
  }, [explorePosts, initialRender]);

  useEffect(() => {
    setValue(1);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="main-page">
      {loading ? (
        <h1>Loading...</h1>
      ) : allPosts === [] ? (
        <h1>No posts to display </h1>
      ) : (
        explorePosts
          ?.slice(0)
          .reverse()
          .map((post) => (
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
        To find more posts navigate to the home page using the navbar
      </Typography>
    </div>
  );
};

export default ExplorePage;
