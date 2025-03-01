import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import projectorRoutes from "./routes/projectors.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";

// Initialisation de l'application
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000; // port: 3000 par défaut en cas d'erreur dans  .env

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/projectors", projectorRoutes);
app.use("/reservations", reservationRoutes);

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
