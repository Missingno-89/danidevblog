import express from "express";
import uploadImg from "../middlewares/cloudinary.js";
import { authenticate } from "../middlewares/authenticate.js";
import {
  getAllPosts,
  getPostbyID,
  createPost,
  updatePost,
  deletePost,
  uploadCover,
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment
} from "../controllers/post.js";

const PostRouter = express.Router();

PostRouter.get("/", getAllPosts);
PostRouter.get("/:id", getPostbyID);
PostRouter.post("/", authenticate, createPost);
PostRouter.put("/:id", updatePost);
PostRouter.delete("/:id", authenticate, deletePost);
PostRouter.patch("/:id/cover",authenticate,uploadImg.single("cover"),uploadCover);
PostRouter.post("/:id/comments", authenticate, createComment);
PostRouter.get("/:id/comments", getComments);
PostRouter.get("/:id/comments/:commentId", getCommentById);
PostRouter.put("/:id/comments/:commentId", updateComment);
PostRouter.delete("/:id/comments/:commentId", deleteComment);

export default PostRouter;