import sqlite3 from "sqlite3";

// Création de la connexion SQLite
const db = new sqlite3.Database("./projecteur.db", (err) => {
  if (err) {
    console.error("Erreur lors de la connexion à SQLite :", err.message);
  } else {
    console.log("Connexion réussie à la base de données SQLite !");
  }
});

// Création des tables nécessaires
db.serialize(() => {
  // Table des utilisateurs
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id_user INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      prenom TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('etudiant', 'enseignant', 'administrateur'))
    )
  `, (err) => {
    if (err) console.error("Erreur lors de la création de la table users :", err.message);
  });

  // Table des projecteurs
  db.run(`
    CREATE TABLE IF NOT EXISTS projectors (
      id_projector INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      cables TEXT NOT NULL CHECK (cables IN ('HDMI', 'VGA')),
      status TEXT NOT NULL DEFAULT 'available'
    )
  `, (err) => {
    if (err) console.error("Erreur lors de la création de la table projectors :", err.message);
  });

  // Table des réservations
  db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      projector_id INTEGER NOT NULL,
      date_reservation DATE NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id_user),
      FOREIGN KEY(projector_id) REFERENCES projectors(id_projector)
    )
  `, (err) => {
    if (err) console.error("Erreur lors de la création de la table reservations :", err.message);
  });
});

export default db;
