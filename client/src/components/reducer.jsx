const reducer = (state, action) => {
  switch (action.type) {
    case "USER":
      return { ...state, userInfo: action.payload };
    case "GET_POSTS":
      return { ...state, allPosts: action.payload, loading: false };
    case "UPDATE_POSTS":
      return { ...state, allPosts: action.payload };
    case "LOADING":
      return { ...state, loading: true };
  }
};

export default reducer;
