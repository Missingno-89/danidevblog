import Author from "../models/Author.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function login(req, res) {
    try {
        const {
            email, password
        } = req.body;
        const author = await Author.findOne({
            email
        });
        if (!author){
            return res.status(401).json ({message: "Wrong Credential"})
        }
        const result = bcrypt.compare(password,author.password)
        if (!result){
             return res.status(401).json ({message: "Wrong Credential"})
        }
        const token = jwt.sign({
            id: author._id
        },process.env.JWT_SECRET,{
            expiresIn: process.env.JWT_EXPIREIN
        });
        res.status(200).json ({token});

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

export async function me(req,res){
    res.status(200).json(req.author)
}

