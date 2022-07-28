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
} = require("../controllers/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resetToken").put(resetPassword);
router.route("/follow").put(protect, followUser);
router.route("/unfollow").put(protect, unfollowUser);

module.exports = router;
