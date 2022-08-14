const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

const {
  register,
  login,
  followUser,
  unfollowUser,
  getUser,
  changeProfilePhoto,
  deleteUserAccount,
} = require("../controllers/auth");

router
  .route("/")
  .patch(protect, changeProfilePhoto)
  .delete(protect, deleteUserAccount);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/follow").put(protect, followUser);
router.route("/unfollow").put(protect, unfollowUser);
router.route("/user/:userId").get(getUser);

module.exports = router;
