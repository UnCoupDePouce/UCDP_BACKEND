import express from "express";
import { addOffre, updateOffre, fermerOffre } from "../controllers/mission.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {getAllOffres, getOffreById} from "../controllers/mission.controller.js";

const router = express.Router();

router.get("/", getAllOffres);
router.get("/:id", getOffreById);

router.post("/", authMiddleware, addOffre);
router.put("/:id", authMiddleware, updateOffre);
router.patch("/:id/fermer", authMiddleware, fermerOffre);

export default router;

