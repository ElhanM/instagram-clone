import axios from "axios";
import React, { useState, useContext, useReducer, useEffect } from "react";
import reducer from "./reducer";

const AppContext = React.createContext();

const initialState = { userInfo: null, allPosts: [], loading: true };

const CLOUDINARYURL =
  "https://api.cloudinary.com/v1_1/instagram-clone-web-app/image/upload";

const baseURL =
  process.env.REACT_APP_LOCAL_URL ||
  "https://instagram-clone-by-elco.herokuapp.com";
const postsURL = `${baseURL}/api/posts`;
const authURL = `${baseURL}/api/auth`;

const likeURL = `${postsURL}/like`;
const unlikeURL = `${postsURL}/unlike`;
const commentURL = `${postsURL}/add/comment`;

const loginURL = `${authURL}/login`;
const registerURL = `${authURL}/register`;

const AppProvider = ({ children }) => {
  const [value, setValue] = useState();

  const [state, dispatch] = useReducer(reducer, initialState);
  const userDispatch = (userData) => {
    dispatch({ type: "USER", payload: userData });
  };
  const axiosGetPosts = async () => {
    try {
      dispatch({ type: "LOADING" });

      const response = await axios(postsURL, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const {
        data: { posts },
      } = response;
      dispatch({ type: "GET_POSTS", payload: posts });
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (postId, addComment, posts) => {
    try {
      const response = await axios.put(
        commentURL,
        { postId, text: addComment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const updatedPosts = posts.map((post) => {
        if (post._id === response.data.comment._id) {
          return { ...post, comments: response.data.comment.comments };
        } else {
          return post;
        }
      });
      updatePostsDispatch(updatedPosts);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteComment = async (postId, commentId, posts) => {
    try {
      const response = await axios.put(
        `${postsURL}`,
        { postId, commentId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const updatedPosts = posts?.map((post) => {
        if (post?._id === postId) {
          return { ...post, comments: response?.data?.comment?.comments };
        } else {
          return post;
        }
      });
      updatePostsDispatch(updatedPosts);
    } catch (error) {
      console.log(error);
    }
  };
  const editComment = async (postId, inputs, posts) => {
    try {
      const response = await axios.put(
        `${postsURL}/post/${postId}`,
        {
          commentId: inputs.editCommentId,
          commentText: inputs.editComment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const updatedPosts = posts?.map((post) => {
        if (post?._id === postId) {
          return response.data.post;
        } else {
          return post;
        }
      });
      updatePostsDispatch(updatedPosts);
    } catch (error) {
      console.log(error);
    }
  };
  const followRequest = async (userId, posts, url = "unfollow") => {
    try {
      const response = await axios.put(
        `${authURL}/${url === "follow" ? "follow" : "unfollow"}`,
        {
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const updatedPosts = posts?.map((post) => {
        if (post?.user?._id === userId) {
          return {
            ...post,
            user: {
              ...post.user,
              following:
                url === "follow"
                  ? response.data.followUser.following
                  : response.data.unfollowUser.following,
              followers:
                url === "follow"
                  ? response.data.followUser.followers
                  : response.data.unfollowUser.followers,
            },
          };
        } else {
          return post;
        }
      });
      updatePostsDispatch(updatedPosts);
    } catch (error) {
      console.log(error);
    }
  };
  const cloudinaryRequest = async (image, setImageUrl) => {
    try {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "instagram-clone");
      data.append("cloud_name", "instagram-clone-web-app");

      const response = await axios.post(CLOUDINARYURL, data);
      setImageUrl(response.data.url);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    axiosGetPosts();
  }, []);
  const updatePostsDispatch = (postsData) => {
    dispatch({ type: "UPDATE_POSTS", payload: postsData });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        baseURL,
        postsURL,
        authURL,
        likeURL,
        unlikeURL,
        commentURL,
        loginURL,
        registerURL,
        postsURL,
        userDispatch,
        updatePostsDispatch,
        handleSubmit,
        deleteComment,
        editComment,
        followRequest,
        cloudinaryRequest,
        value,
        setValue
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
