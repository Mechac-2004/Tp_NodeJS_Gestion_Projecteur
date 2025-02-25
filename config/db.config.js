const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database("./projecteur.db", (err) => {
  if (err) {
    console.error("Erreur lors de la connexion à SQLite :", err.message);
  } else {
    console.log("Connexion réussie à SQLite !");
  }
});

// Gestion de la fermeture de la base proprement
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Erreur lors de la fermeture de la base SQLite :", err.message);
    } else {
      console.log("Base de données SQLite fermée.");
    }
    process.exit(0);
  });
});

module.exports = db;
