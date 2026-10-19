import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";

import Authorrouter from "./routes/authors.js";
import PostRouter from "./routes/post.js";
import Authrouter from "./routes/auth.js";
import { authenticate } from "./middlewares/authenticate.js";
import passport from "passport";
import GoogleStrategy from "./strategies/google.js";

const server = express();

server.use(cors({
  origin: [
    "http://localhost:3000",
    process.env.FRONTEND_URL
  ]
}));

server.use(express.json());
passport.use(GoogleStrategy)

// Rotte
server.use("/auth" , Authrouter)
//server.use(authenticate);
server.use("/authors", Authorrouter);
server.use("/blogPosts", PostRouter);

try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connessione riuscita");
} catch (error) {
    console.error("Errore connessione:", error);
}

server.listen(9097, () => {
    console.log("Server avviato sulla porta 9097");
});

