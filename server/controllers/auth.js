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
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }
    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }
    res.status(200).json({ msg: "User logged in successfully", user });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
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
