import express from "express";
import { addOffre, updateOffre, fermerOffre,searchOffres } from "../controllers/mission.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {getAllOffres, getOffreById} from "../controllers/mission.controller.js";
import logger from "../utils/logger.js";

const router = express.Router();

router.get("/", logger.asyncHandler(getAllOffres));
router.get("/:id", logger.asyncHandler(getOffreById));

router.post("/", authMiddleware, logger.asyncHandler(addOffre));
router.put("/:id", authMiddleware, logger.asyncHandler(updateOffre));
router.patch("/:id/fermer", authMiddleware, logger.asyncHandler(fermerOffre));
router.post("/search",  logger.asyncHandler(searchOffres));

export default router;

