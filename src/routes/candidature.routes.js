import express from "express";
import {
    getCandidatures,
    getCandidaturesClient,
    postulerOffre,
    refuserCandidature,
    validerCandidature
} from "../controllers/candidature.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/apply", authMiddleware, postulerOffre);
router.get("/me", authMiddleware, getCandidatures);
router.get("/client", authMiddleware, getCandidaturesClient);
router.patch("/:id/valider", authMiddleware, validerCandidature);
router.patch("/:id/refuser", authMiddleware, refuserCandidature);

export default router;