const reducer = (state, action) => {
  switch (action.type) {
    case "USER":
      return { ...state, userInfo: action.payload };
  }
};

export default reducer;
