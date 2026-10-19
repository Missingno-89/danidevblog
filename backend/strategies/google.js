
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Author from "../models/Author.js";
import jwt from "jsonwebtoken";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },

  async (accessToken, refreshToken, profile, done) => {
    try {
      let author = await Author.findOne({
        googleId: profile.id
      });

      const googleAvatar = profile.photos?.[0]?.value;
      console.log("Foto ricevuta da Google:", profile.photos);

      if (!author) {
        author = new Author({
          name: profile.name.givenName,
          surname: profile.name.familyName,
          email: profile.emails[0].value,
          googleId: profile.id,
          avatar: googleAvatar
        });

        await author.save();

      } else if (
        googleAvatar &&
        author.avatar !== googleAvatar
      ) {
        author.avatar = googleAvatar;
        await author.save();
      }

      // Generiamo il token JWT
      const token = jwt.sign(
        {
          id: author._id
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIREIN
        }
      );

      done(null, { token });

    } catch (error) {
      done(error);
    }
  }
);

export default googleStrategy;
