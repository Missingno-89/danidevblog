import express from "express";
import { login, me, register } from "../controllers/auth.js";
import { authenticate } from "../middlewares/authenticate.js";
import passport from "passport";


const Authrouter = express.Router();

Authrouter.post("/register", register);
Authrouter.post("/login", login);


Authrouter.get("/google",passport.authenticate("google",{scope:['profile','email']}))
Authrouter.get("/google/callback", passport.authenticate('google',{session:false}),
(req,res) =>{
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${req.user.token}`)
}
)
Authrouter.get("/me", authenticate, me);
export default Authrouter

