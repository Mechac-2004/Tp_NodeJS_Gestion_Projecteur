import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js"; 

const { authenticateToken } = authMiddleware;

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authenticateToken, (req, res) => {
    res.json(req.user);
});

export default router;