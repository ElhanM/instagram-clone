const Post = require("../models/Post");
const ErrorResponse = require("../utils/errorResponse");

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({})
      .populate("user", "_id username")
      .populate("comments.user", "_id username");
    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};

const getAllPostsByUser = async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.params.user }).populate(
      "user",
      "_id username"
    );
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
    ).populate("comments.user", "username");
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
    ).populate("comments.user", "username");
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
    ).populate("comments.user", "username");
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
      .populate("user", "username")
      .populate("comments.user", "username");
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

const editPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOneAndUpdate({ _id: postId }, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ post });
  } catch (error) {
    res.status(404).json({ msg: `No post with id : ${postId}`, status: 404 });
  }
};

module.exports = {
  getAllPosts,
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
};
