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
  getAllUsers,
  unfollowAllUsers,
  getAllUserLikes,
  getUsersFollowersFollowing,
} = require("../controllers/auth");

router
  .route("/")
  .post(getAllUsers)
  .patch(protect, changeProfilePhoto)
  .delete(protect, deleteUserAccount);
router.route("/user-likes").post(getAllUserLikes);
router.route("/user-followers-following").post(getUsersFollowersFollowing);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/follow").put(protect, followUser);
router.route("/unfollow").put(protect, unfollowUser);
router.route("/unfollow/all").put(protect, unfollowAllUsers);
router.route("/user/:userId").get(getUser);

module.exports = router;
