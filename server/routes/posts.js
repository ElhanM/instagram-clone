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
  editComment,
  deleteAllPostsByUser,
} = require("../controllers/posts");

router
  .route("/")
  .get(getAllPosts)
  .post(protect, createPost)
  .put(protect, deleteComment)
  .delete(protect, deleteAllPostsByUser);
router.route("/user-posts/:user").get(getAllPostsByUser);
router
  .route("/post/:postId")
  .put(protect, editComment)
  .get(getPost)
  .patch(protect, editPost)
  .delete(protect, deletePost);
router.route("/post/:postId").put(protect, editComment);
router.route("/like").put(protect, likePost);
router.route("/unlike").put(protect, unlikePost);
router.route("/add/comment").put(protect, comment);

module.exports = router;
