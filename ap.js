const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth.routes.js');
const projectorRoutes = require('./routes/projectorRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api', projectorRoutes);
app.use('/api', reservationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
