import mongoose, { Types } from "mongoose";
import Author from "../models/Author.js";
import sendGrid from "@sendgrid/mail";
import bcrypt from "bcrypt"

export async function getAllAuthors(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const allAuthors = await Author.find().skip(skip).limit(limit);
        res.status(200).json(allAuthors)

    } catch (error) {
        res.status(500).json({ message: error.message });
    }


}

export async function createAuthors(req, res) {
    try {
        const { name, surname, email,password, dob, avatar } = req.body;
       // const hashedpassword = await bcrypt.hash(password,10)
        const author = new Author({ name, surname,email, password,
            //password: hashedpassword,
             dob, avatar });
        const savedAuthor = await author.save();
        sendGrid.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
            to:savedAuthor.email,
            from:"aprea.dany@gmail.com",
            subject:"Benvenuto su striveblog",
            text:"registrato correttamente",
            html:"registrato correttamente"
        }
        const [response]= await sendGrid.send(msg)

        console.log("status",response.statusCode)

        res.status(201).json(savedAuthor)
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getAuthorbyID(req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "invalid id" });
        }
        const author = await Author.findById(id);
        if (!author) {
            return res.status(404).json({ message: "author not found" });
        }
        res.status(200).json(author);


    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}
export async function upDateAuthor(req, res) {
    try {
        const { id } = req.params;
        const { name, surname, email, dob, avatar } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "invalid id" });
        }
        const upDateAuthor = await Author.findByIdAndUpdate(
            id,
            { name, surname, email, dob, avatar },
            { returnDocument: "after" },
        );
        if (!upDateAuthor) {
            return res.status(404).json({ message: "author not found" })
        }
        res.status(200).json(upDateAuthor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export async function deleteAuthor(req, res) {
    try {
        const { id } = req.params;
        const { name, surname, email, dob, avatar } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "invalid id" });
        }
        const deleteAuthor = await Author.findByIdAndDelete(id);

        if (!deleteAuthor) {
            return res.status(404).json({ message: "author not found" })
        }
        res.status(200).json({ message: "author deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export const uploadAvatar = async (req, res) => {
    const { id } = req.params
    try {

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: "invalid id" })
        if (!req.file) {
            return res.status(400).json({ message: "file not uploaded" })
        }

        const author = await Author.findByIdAndUpdate(id, {
            avatar: req.file.path
        }, { returnDocument: "after" })

        if (!author) {
            return res.status(404).json({ message: "author not found" })
        }

        res.status(200).json(author)
    } catch (e) {
        res.status(500)
            .json({ message: e.message })
    }
}

