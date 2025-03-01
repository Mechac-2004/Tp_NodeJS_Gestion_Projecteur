import express from "express";
import { bookProjector, cancelReservation, getAllReservations } from "../controllers/reservation.controller.js";
import authMiddleware from "../middleware/auth.middleware.js"; 

const { authenticateToken } = authMiddleware;

const router = express.Router();

router.post("/", authenticateToken, bookProjector);
router.delete("/:id", authenticateToken, cancelReservation);
router.get("/", authenticateToken, getAllReservations);

export default router;