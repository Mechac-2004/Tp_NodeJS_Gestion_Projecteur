const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware.js');
const authorizeRole = require('../middleware/auth.middleware.js');

router.post('/', authenticateToken, authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { name } = req.body;
        await db.query('INSERT INTO projectors (name) VALUES (?)', [name]);
        res.status(201).json({ message: 'Projecteur ajouté avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du projecteur' });
    }
});
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM projectors');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des projecteurs' });
    }
});

router.put('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await db.query('UPDATE projectors SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'État du projecteur mis à jour avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'état du projecteur' });
    }
});

router.delete('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM projectors WHERE id = ?', [id]);
        res.json({ message: 'Projecteur supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression du projecteur' });
    }
});

module.exports = router;