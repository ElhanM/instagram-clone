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
} = require("../controllers/posts");

router.route("/").get(getAllPosts).post(protect, createPost);
router.route("/my-posts").get(protect, getAllPostsByUser);
router.route("/:id").get(getPost).patch(updatePost).delete(deletePost);

module.exports = router;
