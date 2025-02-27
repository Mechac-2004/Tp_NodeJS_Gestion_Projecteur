import express from "express";
import { addProjector, getProjectors, updateProjector, deleteProjector } from "../controllers/projector.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, addProjector);
router.get("/", verifyToken, getProjectors);
router.put("/:id", verifyToken, updateProjector);
router.delete("/:id", verifyToken, deleteProjector);

export default router;