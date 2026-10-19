import jwt from "jsonwebtoken"
import Author from "../models/Author.js";


export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "unvalid token" })
    }
    const jwtToken = authHeader.split(' ')[1]
    jwt.verify(jwtToken, process.env.JWT_SECRET, async function (error, payload) {
        if (error) {
            return res.status(401).json({ message: "unvalid token" })
        }
        try {
            const { id } = payload;
            const author = await Author.findById(id);

            if (!author) {
                return res.status(401).json({ message: "author not found" });
            }

            req.author = author;
            next();

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    });
}

