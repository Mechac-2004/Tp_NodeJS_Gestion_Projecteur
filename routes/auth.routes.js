const express = require('express');
const { register, login } = require('../controllers/auth.controller.js');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware.js');

router.get('/profile', authenticateToken, (req, res) => {
    res.json(req.user);
});

router.post('/register', register);
router.post('/login', login);

module.exports = router;
