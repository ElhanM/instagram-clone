const Post = require("../models/Post");

const getAllPosts = async (req, res) => {
  const posts = await Post.find({});
  res.status(200).json({ posts });
};

const createPost = async (req, res) => {
  const post = await Post.create(req.body);
  res.status(201).json({ post });
};

const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ _id: id });
    res.status(200).json({ post });
  } catch (error) {
    res.status(404).json({ msg: `No post with id : ${id}`, status: 404 });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOneAndDelete({ _id: id });
    res.status(200).json({ post });
  } catch (error) {
    res.status(404).json({ msg: `No post with id : ${id}`, status: 404 });
  }
};

const updatePost = async (req, res) => {
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
