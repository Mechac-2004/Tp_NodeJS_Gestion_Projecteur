const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

exports.register = (req, res) => {
    const { email, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [email, hashedPassword, role || 'etudiant'],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Erreur lors de l'inscription" });
            res.status(201).json({ message: "Utilisateur inscrit avec succès" });
        }
    );
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ message: "Utilisateur non trouvé" });

        const user = results[0];
        if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ message: "Mot de passe incorrect" });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    });
};
