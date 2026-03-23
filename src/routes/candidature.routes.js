import express from "express";
import {getMesCandidatures, postulerOffre} from "../controllers/candidature.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/apply", authMiddleware, postulerOffre);
router.get("/me", authMiddleware, getMesCandidatures);

export default router;