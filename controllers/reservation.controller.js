import db from "../config/db.config.js";

/* Réservation d'un projecteur */
export const bookProjector = (req, res) => {

    const { id_projector, date_reservation, start_time, end_time } = req.body;
    const user_id = req.user.id;

    if (!id_projector || !date_reservation || !start_time || !end_time) {
        return res.status(400).json({ message: "Projecteur, date et heures requis" });
    }

    // Vérification du format des heures (HH:MM)
    const timeRegex = /^([0-9]{2}):([0-9]{2})$/;
    if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
        return res.status(400).json({ message: "Format des heures invalide (HH:MM requis)" });
    }

    const [startHour, startMinute] = start_time.split(":").map(Number);
    const [endHour, endMinute] = end_time.split(":").map(Number);

    // Vérification des plages horaires
    if (
        startHour < 0 || startHour > 23 || startMinute < 0 || startMinute > 59 ||
        endHour < 0 || endHour > 23 || endMinute < 0 || endMinute > 59
    ) {
        return res.status(400).json({ message: "Les heures doivent être entre 00:00 et 23:59" });
    }

    if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
        return res.status(400).json({ message: "L'heure de début doit être avant l'heure de fin" });
    }

    // Vérification de la disponibilité du projecteur
    db.get(`SELECT * FROM projectors WHERE id_projector = ?`, [id_projector ], (err, projector) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).json({ message: "Erreur interne" });
        }

        if (!projector) return res.status(404).json({ message: "Projecteur non trouvé" });

        if (projector.status !== "available") {
            return res.status(400).json({ message: "Ce projecteur est déjà réservé" });
        }

        // Vérifier si le projecteur est déjà réservé sur ce créneau
        db.get(
            `SELECT * FROM reservations 
             WHERE id_projector = ? AND date_reservation = ? 
             AND ((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?))`,
            [id_projector, date_reservation, start_time, start_time, end_time, end_time],
            (err, existingReservation) => {
                if (err) {
                    console.error("Erreur SQL :", err);
                    return res.status(500).json({ message: "Erreur lors de la vérification des réservations" });
                }

                if (existingReservation) {
                    return res.status(400).json({ message: "Ce projecteur est déjà réservé sur ce créneau" });
                }

                // Enregistrement de la réservation
                db.run(
                    `INSERT INTO reservations (user_id, id_projector, date_reservation, start_time, end_time) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [user_id, id_projector, date_reservation, start_time, end_time],
                    function (err) {
                        if (err) {
                            console.error("Erreur SQL :", err);
                            return res.status(500).json({ message: "Erreur lors de la réservation" });
                        }

                        // Rendre ce projecteur indisponible
                        db.run(
                            `UPDATE projectors SET status = 'reserved' WHERE id_projector = ?`,
                            [id_projector]
                        );

                        res.status(201).json({ message: "Réservation confirmée", id_reservation: this.lastID });
                    }
                );
            }
        );
    });
};

/* Annuler une réservation */
export const cancelReservation = (req, res) => {
    const id = req.params.id;

    // Vérification de la conformité de la réservation
    db.get(`SELECT * FROM reservations WHERE id = ?`, [id], (err, reservation) => {
        if (err) {
            console.error("Erreur dans la requête SQL :", err);
        }
        if (!reservation) {
            return res.status(404).json({ message: "Réservation non trouvée" });
        }

        // Suppression de la réservation
        db.run(`DELETE FROM reservations WHERE id = ?`, [id], function (err) {
            if (err) return res.status(500).json({ message: "Erreur lors de l'annulation" });
            
            // Rendre le projecteur à nouveau disponible à la fin de la réservation
            db.run(
                `UPDATE projectors SET status = 'available' WHERE id_projector = ?`,
                [reservation.id_projector]
            );
            
            res.json({ message: "Réservation annulée", id_reservation: this.lastID });
        });
    });
};

/* Voir toutes les réservations */
export const getAllReservations = (req, res) => {
    if (req.user.role !== "administrateur") {
        return res.status(403).json({ message: "Accès refusé" });
    }

    db.all(`SELECT * FROM reservations`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la récupération" });

        res.json(rows);
    });
};