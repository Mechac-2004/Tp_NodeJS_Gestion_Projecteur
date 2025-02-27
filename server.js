import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import projectorRoutes from "./routes/projector.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes.js');
const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

/* Les routes */
app.use("/auth", authRoutes);
app.use("/projectors", projectorRoutes);
app.use("/reservations", reservationRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});




