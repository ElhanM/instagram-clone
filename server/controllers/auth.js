const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

const register = async (req, res, next) => {
  const { username, email, password, profilePhoto } = req.body;
  try {
    const user = await User.create({ username, email, password, profilePhoto });
    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({
      username: { $regex: `${req.body.searchValue}` },
    })
      .sort({ username: 1 })
      .limit(5);
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

const getAllUserLikes = async (req, res, next) => {
  try {
    const users = await User.find({
      _id: { $in: [...req.body.users] },
    });
    res.status(200).json({ users });
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

const unfollowAllUsers = async (req, res, next) => {
  try {
    const unfollowAllUsers = await User.updateMany(
      // find all users that the user is following remove user from their followers array
      { followers: req.user._id },
      { $pull: { followers: req.user._id } },
      { new: true }
    );

    res.status(201).json({ unfollowAllUsers });
  } catch (error) {
    next(error);
  }
};

const changeProfilePhoto = async (req, res, next) => {
  const { profilePhoto } = req.body;
  try {
    const changeProfilePhoto = await User.findOneAndUpdate(
      { _id: req.user._id },
      { profilePhoto },
      { new: true }
    );
    res
      .status(201)
      .json({ msg: "Profile photo updated successfully", changeProfilePhoto });
  } catch (error) {
    next(error);
  }
};

const deleteUserAccount = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.user._id });
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  followUser,
  unfollowUser,
  getUser,
  changeProfilePhoto,
  deleteUserAccount,
  getAllUsers,
  unfollowAllUsers,
  getAllUserLikes,
};
