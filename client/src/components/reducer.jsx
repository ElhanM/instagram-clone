const reducer = (state, action) => {
  if (action.type === "USER") {
    // update userInfo in state
    return { ...state, userInfo: action.payload };
  }
};

export default reducer;
