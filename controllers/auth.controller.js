import db from "../config/db.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "secret";

/* REGISTER  */
export const register = (req, res) => {
    const { nom, prenom, email, password, role } = req.body;

    // Vérification de l'existence auparavant de l'user
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err) {
            console.log("Erreur ", err);
            
            return res.status(500).json({ message: "Erreur serveur." });
        }
        if (user) return res.status(400).json({ message: "Email déjà utilisé." });

        // Hashage du password et enregistrement de l'user
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            "INSERT INTO users (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)",
            [nom, prenom, email, hashedPassword, role],
            function (err) {
                if (err) {
                    console.log("Erreur lors de l'ajout de l'utilisateur dans la base de données :", err);
                    return res.status(500).json({ message: "Erreur lors de l'inscription." });
                } else {
                    res.status(201).json({ message: "Utilisateur enregistré." });
                }
            }
        );
    });
};

/* LOGIN */
export const login = (req, res) => {
    const { email, password } = req.body;

    // Vérification de l'exitsence d'un user avec ces credientials
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err) return res.status(500).json({ message: "Erreur serveur." });
        if (!user) return res.status(401).json({ message: "Identifiants incorrects." });

        // Vérification du password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Identifiants incorrects." });

        // Génération du token
        const token = jwt.sign({ id: user.id_user, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ message: "Utilisateur connecté !", token });
    });
};
