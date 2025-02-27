import express from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();
const express = require('express');
const { register, login } = require('../controllers/auth.controller.js');
const authenticateToken = require('../middleware/auth.middleware.js');

router.post("/register", register);
router.post("/login", login);

router.get('/profile', authenticateToken, (req, res) => {
    res.json(req.user);
});

export default router;