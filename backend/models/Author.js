import mongoose from "mongoose";
import bcrypt from "bcrypt";

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 1,
    max: 255
  },
  surname: {
    type: String,
    required: true,
    min: 1,
    max: 255
  },
  email: {
    type: String,
    required: true,
    unique: true,
    min: 1,
    max: 255
  },
  password: {
    type: String,
    select: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  dob: {
    type: Date,
    required: false
  },
  avatar: {
    type: String
  }
});

authorSchema.pre("save", async function () {
  if (!this.password || !this.isModified("password")) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (e) {
    throw e;
  }
});

const Author = mongoose.model("Author", authorSchema);

export default Author;