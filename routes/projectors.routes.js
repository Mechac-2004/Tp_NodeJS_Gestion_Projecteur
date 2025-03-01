import express from "express";
import { addProjector, getProjectors, updateProjector, deleteProjector } from "../controllers/projector.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const { authenticateToken, authorizeRole } = authMiddleware;

const router = express.Router();

router.post("/", authenticateToken,  authorizeRole(['administrateur']), addProjector);
router.get("/", authenticateToken, getProjectors);
router.put("/:id", authenticateToken, authorizeRole(['administrateur']),  updateProjector);
router.delete("/:id", authenticateToken, authorizeRole(['administrateur']), deleteProjector);

export default router;