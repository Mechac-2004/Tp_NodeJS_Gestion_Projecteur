import db from "../config/db.config.js";

// Ajouter un projecteur
export const addProjector = (name, cables, status, callback) => {
    // requête sql pour l'insertion d'un projecteur
  const add_projector = `
    INSERT INTO projectors (name, cables, status) 
    VALUES (?, ?, ?)
  `;
  db.run(add_projector, [name, cables, status], function (err) {
    callback(err, this ? this.lastID : null);
  });
};

// Récupérer tous les projecteurs
export const getProjectors = (callback) => {
    // requête sql pour sélectionner tous les projecteurs insérer 
  const show_projector = "SELECT * FROM projectors";
  db.all(show_projector, [], (err, rows) => {
    callback(err, rows);
  });
};

// Mettre à jour un projecteur
export const updateProjector = (id_projector, name, cables, status, callback) => {
    // requête sql pour modifier un projecteur spécifique
  const update_projector = `
    UPDATE projectors 
    SET name = ?, cables = ?, status = ? 
    WHERE id_projector = ?
  `;
  db.run(update_projector, [name, cables, status, id_projector], function (err) {
    callback(err, this ? this.changes : null);
  });
};

// Supprimer un projecteur
export const deleteProjector = (id_projector, callback) => {
    // requête sql pour supprimer un projecteur spécifique 
  const delete_projector = "DELETE FROM projectors WHERE id_projector = ?";
  db.run(delete_projector, [id_projector], function (err) {
    callback(err, this ? this.changes : null);
  });
};
