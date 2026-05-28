import express from "express";
import {findById, login, register, updateUser, findAll} from "../controllers/user.controller.js";
import { registerValidator, loginValidator } from "../validators/user.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { isAdmin , authMiddleware } from "../middlewares/auth.middleware.js";
import logger from "../utils/logger.js";

const router = express.Router();

router.get("/:id", logger.asyncHandler(findById));
router.post("/register", registerValidator, validate, logger.asyncHandler(register));
router.post("/login", loginValidator, validate, logger.asyncHandler(login));
router.put("/update", registerValidator,authMiddleware,isAdmin, validate, logger.asyncHandler(updateUser));
router.get("/all",authMiddleware,isAdmin, logger.asyncHandler(findAll));


export default router;
