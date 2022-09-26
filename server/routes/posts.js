const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

const {
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
  unlikeAllPosts,
  getAllHomePosts,
  getAllExplorePosts,
} = require("../controllers/posts");

router
  .route("/")
  .post(protect, createPost)
  .put(protect, deleteComment)
  .delete(protect, deleteAllPostsByUser);
router.route("/home-posts").get(protect, getAllHomePosts);
router.route("/explore-posts").get(protect, getAllExplorePosts);
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
router.route("/unlike/all").put(protect, unlikeAllPosts);
router.route("/add/comment").put(protect, comment);

module.exports = router;
