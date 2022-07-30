const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

const register = async (req, res, next) => {
  const { username, email, password, profilePhoto } = req.body;
  try {
    const user = await User.create({ username, email, password, profilePhoto });
    sendToken(user, 201, res);
    res.status(201).json({ msg: "User created successfully", user });
  } catch (error) {
    next(error);
  }
};
const getUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.find({ _id: userId });
    res.status(201).json({ user });
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
    // this.password refers to the password in the user object, not the password in the req.body
    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }
    sendToken(user, 200, res);
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

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

const followUser = async (req, res, next) => {
  try {
    const followUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        $push: { followers: req.user._id },
      },
      { new: true }
    );
    const updateFollowing = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { following: req.body.userId },
      },
      { new: true }
    );
    res.status(201).json({ followUser, updateFollowing });
  } catch (error) {
    next(error);
  }
};

const unfollowUser = async (req, res, next) => {
  try {
    const unfollowUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        $pull: { followers: req.user._id },
      },
      { new: true }
    );
    const updateFollowing = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.userId },
      },
      { new: true }
    );
    res.status(201).json({ unfollowUser, updateFollowing });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  followUser,
  unfollowUser,
  getUser
};
