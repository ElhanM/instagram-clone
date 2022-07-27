import axios from "axios";
import React, { useState, useContext, useReducer, useEffect } from "react";
import reducer from "./reducer";

const AppContext = React.createContext();

const initialState = { userInfo: null, allPosts: [], loading: true };

const baseURL = "http://localhost:5000";
const postsURL = `${baseURL}/api/posts`;
const authURL = `${baseURL}/api/auth`;

const likeURL = `${postsURL}/like`;
const unlikeURL = `${postsURL}/unlike`;
const commentURL = `${postsURL}/add/comment`;

const AppProvider = ({ children }) => {
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
  const editComment = async (postId,inputs,posts) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${postId}`,
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
        userDispatch,
        updatePostsDispatch,
        likeURL,
        unlikeURL,
        commentURL,
        handleSubmit,
        deleteComment,
        editComment
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
