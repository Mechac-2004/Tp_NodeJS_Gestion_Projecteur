import express from "express";
import { bookProjector, cancelReservation, getAllReservations } from "../controllers/reservation.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const { authenticateToken, authorizeRole } = authMiddleware;
const router = express.Router();

router.post("/", authenticateToken, bookProjector);
router.delete("/:id", authenticateToken,  authorizeRole(['administrateur']), cancelReservation);
router.get("/", authenticateToken,  authorizeRole(['administrateur']), getAllReservations);

export default router;