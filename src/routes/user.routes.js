import express from "express";
import {findById, login, register} from "../controllers/user.controller.js";
import { registerValidator, loginValidator } from "../validators/user.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import logger from "../utils/logger.js";

const router = express.Router();

router.get("/:id", logger.asyncHandler(findById));
router.post("/register", registerValidator, validate, logger.asyncHandler(register));
router.post("/login", loginValidator, validate, logger.asyncHandler(login));
router.put("/update", registerValidator, validate, logger.asyncHandler(register));

export default router;
