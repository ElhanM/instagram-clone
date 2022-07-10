const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    res.status(201).json({ msg: "User created successfully", user });
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  res.send("login");
};
const forgotPassword = async (req, res, next) => {
  res.send("forgotpassword");
};
const resetPassword = async (req, res, next) => {
  res.send("resetpassword");
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
