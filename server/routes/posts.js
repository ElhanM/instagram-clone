const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

const {
  getAllPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  getAllPostsByUser,
  likePost,
  unlikePost,
  comment,
} = require("../controllers/posts");

router.route("/").get(getAllPosts).post(protect, createPost);
router.route("/my-posts").get(protect, getAllPostsByUser);
router.route("/:id").get(getPost).patch(updatePost).delete(deletePost);
router.route("/like").put(protect, likePost);
router.route("/unlike").put(protect, unlikePost);
router.route("/comment").put(protect, comment);

module.exports = router;
