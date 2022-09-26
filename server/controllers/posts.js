const Post = require("../models/Post");
const ErrorResponse = require("../utils/errorResponse");

const getAllHomePosts = async (req, res, next) => {
  try {
    const PAGE_SIZE = 2;
    const page = parseInt(
      req.query.page === "0"
        ? "1"
        : parseInt(req.query.page) !== NaN
        ? req.query.page
        : "1"
    );
    const count = await Post.countDocuments({
      user: [req.user._id, ...req.user.following],
    });
    const posts = await Post.find({
      user: [req.user._id, ...req.user.following],
    })
      .sort({ _id: -1 })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * (page - 1))
      .populate("user", "_id username followers following profilePhoto")
      .populate("comments.user", "_id username");
    res.status(200).json({
      info: {
        count,
        pages: Math.ceil(count / PAGE_SIZE),
        next:
          page === Math.ceil(count / PAGE_SIZE)
            ? null
            : `http://localhost:5001/api/posts?page=${page + 1}`,
        previous:
          page === 1
            ? null
            : `http://localhost:5001/api/posts?page=${page - 1}`,
      },
      posts,
    });
  } catch (error) {
    next(error);
  }
};
const getAllExplorePosts = async (req, res, next) => {
  try {
    const PAGE_SIZE = 2;
    const page = parseInt(
      req.query.page === "0"
        ? "1"
        : parseInt(req.query.page) !== NaN
        ? req.query.page
        : "1"
    );
    const count = await Post.countDocuments({
      user: { $nin: [req.user._id, ...req.user.following] },
    });
    const posts = await Post.find({
      user: { $nin: [req.user._id, ...req.user.following] },
    })
      .sort({ _id: -1 })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * (page - 1))
      .populate("user", "_id username followers following profilePhoto")
      .populate("comments.user", "_id username")
      .populate("likes", "_id username");
    res.status(200).json({
      info: {
        count,
        pages: Math.ceil(count / PAGE_SIZE),
        next:
          page === Math.ceil(count / PAGE_SIZE)
            ? null
            : `http://localhost:5001/api/posts?page=${page + 1}`,
        previous:
          page === 1
            ? null
            : `http://localhost:5001/api/posts?page=${page - 1}`,
      },
      posts,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPostsByUser = async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.params.user })
      .populate("user", "_id username followers following profilePhoto")
      .populate("comments.user", "_id username");
    res.status(200).json({ posts });
  } catch (error) {
    return next(
      new ErrorResponse(`No posts from user with id : ${req.params.user}`, 404)
    );
  }
};

const createPost = async (req, res, next) => {
  try {
    req.user.password = undefined;
    const post = await Post.create({ ...req.body, user: req.user });
    res.status(201).json({ post });
  } catch (error) {
    next(error);
  }
};

const likePost = async (req, res, next) => {
  try {
    const likePost = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    );
    res.status(201).json({ likePost });
  } catch (error) {
    next(error);
  }
};
const unlikePost = async (req, res, next) => {
  try {
    const unlikePost = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );
    res.status(201).json({ unlikePost });
  } catch (error) {
    next(error);
  }
};

const comment = async (req, res, next) => {
  try {
    const comment = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: { text: req.body.text, user: req.user._id } },
      },
      { new: true }
    )
      .populate("user", "_id username followers following profilePhoto")
      .populate("comments.user", "_id username");
    res.status(201).json({ comment });
  } catch (error) {
    return next(
      new ErrorResponse(`No post with post id of: ${req.body.postId}`, 404)
    );
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { comments: { _id: req.body.commentId } },
      },
      { new: true }
    )
      .populate("user", "_id username followers following profilePhoto")
      .populate("comments.user", "_id username");
    res.status(200).json({ comment });
  } catch (error) {
    return next(
      new ErrorResponse(
        `No post with post id of: ${req.body.postId} and comment id of: ${req.body.commentId}`,
        404
      )
    );
  }
};
const editComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOneAndUpdate(
      { _id: postId, "comments._id": req.body.commentId },
      { $set: { "comments.$.text": req.body.commentText } },
      { new: true }
    )
      .populate("user", "_id username followers following profilePhoto")
      .populate("comments.user", "_id username");
    res.status(200).json({ post });
  } catch (error) {
    return next(
      new ErrorResponse(
        `No post with post id of: ${req.params.postId} and comment id of: ${req.body.commentId}`,
        404
      )
    );
  }
};

const getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({ _id: postId })
      .populate("user", "_id username followers following profilePhoto")
      .populate("comments.user", "_id username");
    res.status(200).json({ post });
  } catch (error) {
    return next(new ErrorResponse(`No post with id : ${postId}`, 404));
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOneAndDelete({ _id: postId });
    res.status(200).json({ post });
  } catch (error) {
    return next(new ErrorResponse(`No post with id : ${postId}`, 404));
  }
};

const deleteAllPostsByUser = async (req, res, next) => {
  try {
    const posts = await Post.deleteMany({ user: req.user._id });
    res.status(200).json({ posts });
  } catch (error) {
    return next(
      new ErrorResponse(`No posts with userId : ${req.user._id}`, 404)
    );
  }
};

const unlikeAllPosts = async (req, res, next) => {
  try {
    const unfollowAllUsers = await Post.updateMany(
      // find all users that the user is following remove user from their followers array
      { likes: req.user._id },
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    res.status(201).json({ unfollowAllUsers });
  } catch (error) {
    next(error);
  }
};

const editPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOneAndUpdate({ _id: postId }, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("user", "_id username followers following profilePhoto")
      .populate("comments.user", "_id username");
    res.status(200).json({ post });
  } catch (error) {
    res.status(404).json({ msg: `No post with id : ${postId}`, status: 404 });
  }
};

module.exports = {
  getAllPostsByUser,
  createPost,
  editPost,
  deletePost,
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
};
