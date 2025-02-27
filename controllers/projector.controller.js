import db from "../config/db.config.js";

// Ajout d'un nouveau projecteur
export const addProjector = (req, res) => {
    const { name, cables, status } = req.body;

    if (!name || !cables) {
        return res.status(400).json({ message: "Nom et type de câbles requis" });
    }

    db.run(
        `INSERT INTO projectors (name, cables, status) VALUES (?, ?, ?)`,
        [name, cables, status || "available"],
        function (err) {
            if (err) {
                console.log("erreur: ", err);
                return res.status(500).json({ message: "Erreur lors de l'ajout du projecteur" });
            }

            res.status(201).json({ message: "Projecteur ajouté", id: this.lastID });
        }
    );
};

// Récupération de  tous les projecteurs
export const getProjectors = (req, res) => {
    db.all(`SELECT * FROM projectors`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la récupération des projecteurs" });
        } else {
            res.json(rows);
        }

    });
};

// Mettre à jour un projecteur
export const updateProjector = (req, res) => {
    const { id } = req.params;
    const { name, cables, status } = req.body;

    db.run(
        `UPDATE projectors SET name = ?, cables = ?, status = ? WHERE id_projector = ?`,
        [name, cables, status, id],
        function (err) {
            if (err) return res.status(500).json({ message: "Erreur lors de la mise à jour" });

            res.json({ message: "Projecteur mis à jour" });
        }
    );
};

// Supprimer un projecteur
export const deleteProjector = (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM projectors WHERE id_projector = ?`, [id], function (err) {
        if (err) return res.status(500).json({ message: "Erreur lors de la suppression" });

        res.json({ message: "Projecteur supprimé" });
    });
};