import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getLogs } from "../controllers/logger.controller.js";

const router = express.Router();

router.get("/", /*authMiddleware*/ getLogs);

export default router;
