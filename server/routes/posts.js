const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

const {
  getAllPosts,
  createPost,
  editPost,
  deletePost,
  getAllPostsByUser,
  likePost,
  unlikePost,
  comment,
  getPost,
  deleteComment,
} = require("../controllers/posts");

router
  .route("/")
  .get(getAllPosts)
  .post(protect, createPost)
  .put(protect, deleteComment);
router.route("/user-posts/:user").get(getAllPostsByUser);
router
  .route("/:postId")
  .get(getPost)
  .patch(editPost)
  .delete(protect, deletePost);
router.route("/like").put(protect, likePost);
router.route("/unlike").put(protect, unlikePost);
router.route("/comment").put(protect, comment);

module.exports = router;
