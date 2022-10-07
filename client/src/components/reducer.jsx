const reducer = (state, action) => {
  switch (action.type) {
    case "USER":
      return { ...state, userInfo: action.payload };
    case "LOADING":
      return { ...state, loading: true };
  }
};

export default reducer;
