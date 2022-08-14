const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  followUser,
  unfollowUser,
  getUser,
  changeProfilePhoto,
} = require("../controllers/auth");

router.route("/").patch(protect, changeProfilePhoto);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resetToken").put(resetPassword);
router.route("/follow").put(protect, followUser);
router.route("/unfollow").put(protect, unfollowUser);
router.route("/user/:userId").get(getUser);

module.exports = router;
