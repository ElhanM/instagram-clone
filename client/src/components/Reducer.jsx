const Reducer = (state, action) => {
  if (action.type === "USER") {
    console.log("Action.payload log:");
    console.log(action.payload);
    return action.payload;
  }
  return state;
};

export default Reducer;
