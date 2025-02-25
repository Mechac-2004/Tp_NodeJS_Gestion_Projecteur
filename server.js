const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes.js');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Serveur démarré sur le port ${process.env.PORT}`);
});
