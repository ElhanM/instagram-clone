const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    photo: {
      type: String,
      required: [true, "Image is required"],
    },
    likes: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    collection: "posts",
  }
);

module.exports = mongoose.model("post", postSchema);
