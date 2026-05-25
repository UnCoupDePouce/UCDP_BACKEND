import express from "express";
import {
    getCandidatures,
    getCandidaturesClient,
    postulerOffre,
    refuserCandidature,
    validerCandidature
} from "../controllers/candidature.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import logger from "../utils/logger.js";

const router = express.Router();

router.post("/apply", authMiddleware, logger.asyncHandler(postulerOffre));
router.get("/me", authMiddleware, logger.asyncHandler(getCandidatures));
router.get("/client", authMiddleware, logger.asyncHandler(getCandidaturesClient));
router.patch("/:id/valider", authMiddleware, logger.asyncHandler(validerCandidature));
router.patch("/:id/refuser", authMiddleware, logger.asyncHandler(refuserCandidature));

export default router;