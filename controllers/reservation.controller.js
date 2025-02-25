import db from "../config/db.config.js";

// Réserver un projecteur
export const bookProjector = (req, res) => {
    const { id_projector, date_reservation } = req.body;
    const id_user = req.user.id; // Récupéré via le token

    if (!id_projector || !date_reservation) {
        return res.status(400).json({ message: "Projecteur et date requis" });
    }

    // Vérifier si le projecteur est disponible
    db.get(`SELECT * FROM projectors WHERE id_projector = ?`, [id_projector], (err, projector) => {
        if (err || !projector) return res.status(404).json({ message: "Projecteur non trouvé" });

        if (projector.status !== "available") {
            return res.status(400).json({ message: "Ce projecteur est déjà réservé" });
        }

        // Insérer la réservation
        db.run(
            `INSERT INTO reservations (id_user, id_projector, date_reservation, status) VALUES (?, ?, ?, 'confirmed')`,
            [id_user, id_projector, date_reservation],
            function (err) {
                if (err) return res.status(500).json({ message: "Erreur lors de la réservation" });

                // Mettre à jour le status du projecteur
                db.run(
                    `UPDATE projectors SET status = 'reserved' WHERE id_projector = ?`,
                    [id_projector]
                );

                res.status(201).json({ message: "Réservation confirmée", id_reservation: this.lastID });
            }
        );
    });
};

// Annuler une réservation
export const cancelReservation = (req, res) => {
    const { id } = req.params;
    const id_user = req.user.id;

    // Vérifier si la réservation existe et appartient à l'utilisateur
    db.get(`SELECT * FROM reservations WHERE id_reservation = ? AND id_user = ?`, [id, id_user], (err, reservation) => {
        if (err || !reservation) return res.status(404).json({ message: "Réservation non trouvée" });

        // Supprimer la réservation
        db.run(`DELETE FROM reservations WHERE id_reservation = ?`, [id], function (err) {
            if (err) return res.status(500).json({ message: "Erreur lors de l'annulation" });

            // Remettre le projecteur à "available"
            db.run(
                `UPDATE projectors SET status = 'available' WHERE id_projector = ?`,
                [reservation.id_projector]
            );

            res.json({ message: "Réservation annulée" });
        });
    });
};

// Voir toutes les réservations (admin)
export const getAllReservations = (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Accès refusé" });
    }

    db.all(`SELECT * FROM reservations`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la récupération" });

        res.json(rows);
    });
};