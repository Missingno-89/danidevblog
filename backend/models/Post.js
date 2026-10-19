import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    default: "",
  },
  readTime: {
    value: {
      type: Number,
      required: false,
    },
    unit: {
      type: String,
      required: true,
    },
  },
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
