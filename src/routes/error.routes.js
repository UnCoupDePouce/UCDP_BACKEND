import express from "express";
import {} from "../controllers/error.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/error", authMiddleware,);
router.get("/error", authMiddleware, );

export default router;