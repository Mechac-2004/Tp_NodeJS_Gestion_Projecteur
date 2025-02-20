import db from "../config/db.config.js";

// Ajouter un utilisateur
export const addUser = (nom, prenom, email, password, role, callback) => {
    // requête sql pour l'insertion d'un utilisateur 
  const users_add = `
    INSERT INTO users (nom, prenom, email, password, role) 
    VALUES (?, ?, ?, ?, ?)
  `;
  db.run(users_add, [nom, prenom, email, password, role], function (err) {
    callback(err, this ? this.lastID : null);
  });
};

// Récupérer tous les utilisateurs
export const getUsers = (callback) => {
    // requête sql pour sélectionner tous les utilisateurs insérer 
  const users_show = "SELECT * FROM users";
  db.all(users_show, [], (err, rows) => {
    callback(err, rows);
  });
};

// Mettre à jour un utilisateur
export const updateUser = (id_user, nom, prenom, email, password, role, callback) => {
    // requête sql pour modifier un utilisateur spécifique
  const users_update = `
    UPDATE users 
    SET nom = ?, prenom = ?, email = ?, password = ?, role = ? 
    WHERE id_user = ?
  `;
  db.run(users_update, [nom, prenom, email, password, role, id_user], function (err) {
    callback(err, this ? this.changes : null);
  });
};

// Supprimer un utilisateur
export const deleteUser = (id_user, callback) => {
    // requête sql pour supprimer un utilisateur spécifique 
  const users_delete = "DELETE FROM users WHERE id_user = ?";
  db.run(users_delete, [id_user], function (err) {
    callback(err, this ? this.changes : null);
  });
};