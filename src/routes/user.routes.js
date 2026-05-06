import express from "express";
import { findAll, findById, login, loginAdmin, register, updateUserAdmin } from "../controllers/user.controller.js";
import { registerValidator, loginValidator } from "../validators/user.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, findAll);
router.get("/:id", findById);
router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/login-admin", loginValidator, validate, loginAdmin);
router.put("/update", registerValidator, validate, register);
router.patch("/:id", authMiddleware, isAdmin, updateUserAdmin);

export default router;
