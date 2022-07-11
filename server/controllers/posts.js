const Post = require("../models/Post");

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    req.user.password = undefined;
    const post = await Post.create({ ...req.body, user:req.user });
    res.status(201).json({ post });
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ _id: id });
    res.status(200).json({ post });
  } catch (error) {
    return next(new ErrorResponse(`No post with id : ${id}`, 404));
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findOneAndDelete({ _id: id });
    res.status(200).json({ post });
  } catch (error) {
    return next(new ErrorResponse(`No post with id : ${id}`, 404));
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ post });
  } catch (error) {
    res.status(404).json({ msg: `No post with id : ${id}`, status: 404 });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
};
