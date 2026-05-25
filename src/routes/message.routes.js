import { Router } from "express";
import { getConversations } from "../controllers/message.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import logger from "../utils/logger.js";

const router = Router();

router.get("/conversations", authMiddleware, logger.asyncHandler(getConversations));

export default router;
