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
