const User = require("../models/User");

const register = async (req, res) => {
  res.send("register");
};
const login = async (req, res) => {
  res.send("login");
};
const forgotPassword = async (req, res) => {
  res.send("forgotpassword");
};
const resetPassword = async (req, res) => {
  res.send("resetpassword");
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
