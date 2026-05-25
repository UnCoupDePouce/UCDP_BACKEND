import express from "express";
import {getAllMetier} from "../controllers/metier.controller.js";
import logger from "../utils/logger.js";

const router = express.Router();

router.get("/", logger.asyncHandler(getAllMetier));

export default router;