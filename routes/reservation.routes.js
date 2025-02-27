import express from "express";
import { bookProjector, cancelReservation, getAllReservations } from "../controllers/reservation.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, bookProjector);
router.delete("/:id", verifyToken, cancelReservation);
router.get("/", verifyToken, getAllReservations);

export default router;