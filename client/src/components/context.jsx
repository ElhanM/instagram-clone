import axios from "axios";
import React, { useState, useContext, useReducer, useEffect } from "react";
import reducer from "./reducer";
import Cookies from "universal-cookie";

const AppContext = React.createContext();

const initialState = { userInfo: null, allPosts: [] };

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
  const cookies = new Cookies();
  const [refetchProfile, setRefetchProfile] = useState(false);

  const [state, dispatch] = useReducer(reducer, initialState);
  const userDispatch = (userData) => {
    dispatch({ type: "USER", payload: userData });
  };

  const handleSubmit = async (postId, addComment, posts, setPosts) => {
    try {
      const response = await axios.put(
        commentURL,
        { postId, text: addComment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("authToken")}`,
          },
        }
      );
      if (posts) {
        setPosts({ ...posts, comments: response.data.comment.comments });
      }
      console.log(posts);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteComment = async (postId, commentId) => {
    try {
      const response = await axios.put(
        `${postsURL}`,
        { postId, commentId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("authToken")}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  const editComment = async (postId, inputs) => {
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
            Authorization: `Bearer ${cookies.get("authToken")}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  const followRequest = async (userId, url = "unfollow") => {
    try {
      const response = await axios.put(
        `${authURL}/${url === "follow" ? "follow" : "unfollow"}`,
        {
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("authToken")}`,
          },
        }
      );
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
        setValue,
        refetchProfile,
        setRefetchProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useGlobalContext = () => {
  return useContext(AppContext);
};
export const MemoAppProvider = React.memo(AppProvider);
export { AppContext };
