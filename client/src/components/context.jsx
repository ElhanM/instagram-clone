import React, { useState, useContext, useReducer, useEffect } from "react";
import reducer from "./reducer";

const AppContext = React.createContext();

const initialState = { userInfo: null };

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const userDispatch = (userData) => {
    dispatch({ type: "USER", payload: userData });
  };
  return (
    <AppContext.Provider
      value={{
        ...state,
        userDispatch,
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