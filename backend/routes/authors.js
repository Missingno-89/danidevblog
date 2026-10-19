import express from "express";
import { createAuthors, deleteAuthor, getAllAuthors, getAuthorbyID, upDateAuthor, uploadAvatar } from "../controllers/authors.js";
import uploadImg from "../middlewares/cloudinary.js";
const Authorrouter = express.Router();

Authorrouter.get("/", getAllAuthors);
Authorrouter.post("/", createAuthors);
Authorrouter.get("/:id", getAuthorbyID);
Authorrouter.put("/:id", upDateAuthor);
Authorrouter.delete("/:id",deleteAuthor)
Authorrouter.patch("/:id/avatar",uploadImg.single("avatar"),uploadAvatar)
export default Authorrouter;
