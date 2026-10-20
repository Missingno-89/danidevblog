
import Author from "../models/Author.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// LOGIN CON EMAIL E PASSWORD
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Controlliamo i campi obbligatori
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email e password sono obbligatorie"
      });
    }

    // Cerchiamo l'utente, recuperando anche la password
    const author = await Author.findOne({
      email: email.trim().toLowerCase()
    }).select("+password");

    // Utente inesistente oppure registrato soltanto con Google
    if (!author || !author.password) {
      return res.status(401).json({
        message: "Email o password non corrette"
      });
    }

    // Confrontiamo la password con l'hash bcrypt
    const passwordValid = await bcrypt.compare(
      password,
      author.password
    );

    if (!passwordValid) {
      return res.status(401).json({
        message: "Email o password non corrette"
      });
    }

    // Generiamo il token JWT
    const token = jwt.sign(
      { id: author._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIREIN || "1d"
      }
    );

    return res.status(200).json({ token });

  } catch (error) {
    console.error("Errore login:", error.message);

    return res.status(500).json({
      message: "Errore durante il login"
    });
  }
}

// REGISTRAZIONE CON EMAIL E PASSWORD
export async function register(req, res) {
  try {
    const { name, surname, email, password } = req.body;

    // Verifichiamo i dati inseriti
    if (
      typeof name !== "string" ||
      typeof surname !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !surname.trim() ||
      !email.trim() ||
      password.length < 8
    ) {
      return res.status(400).json({
        message:
          "Inserisci nome, cognome, email e una password di almeno 8 caratteri"
      });
    }

    // Normalizziamo l'email
    const normalizedEmail = email.trim().toLowerCase();

    // Controlliamo se l'email esiste già
    const existingAuthor = await Author.findOne({
      email: normalizedEmail
    });

    if (existingAuthor) {
      return res.status(409).json({
        message: "Email già registrata"
      });
    }

    // Creiamo un nuovo utente
    // Il middleware pre-save di Author.js genera l'hash bcrypt
    const author = await Author.create({
      name: name.trim(),
      surname: surname.trim(),
      email: normalizedEmail,
      password
    });

    return res.status(201).json({
      message: "Registrazione completata",
      user: {
        id: author._id,
        name: author.name,
        surname: author.surname,
        email: author.email
      }
    });

  } catch (error) {
    // Mostriamo il dettaglio nel terminale del backend
    console.error("Errore registrazione:", error);

    // MongoDB: errore di chiave duplicata
    if (error.code === 11000) {

      // Email duplicata
      if (error.keyPattern?.email || error.keyValue?.email !== undefined) {
        return res.status(409).json({
          message: "Email già registrata"
        });
      }

      // Identificativo Google duplicato
      if (error.keyPattern?.googleId || error.keyValue?.googleId !== undefined) {
        return res.status(409).json({
          message: "Conflitto con l'identificativo Google"
        });
      }

      // Altro indice duplicato
      return res.status(409).json({
        message: "Conflitto con un dato già presente nel database"
      });
    }

    return res.status(500).json({
      message: "Errore durante la registrazione"
    });
  }
}

// UTENTE AUTENTICATO
export async function me(req, res) {
  return res.status(200).json(req.author);
}
