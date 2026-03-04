import express from "express";
import { getAllPrestataires, getPrestataire, register, login, updatePrestataire, deletePrestataire } from "../controllers/prestataire.controller.js";
import { registerPrestataireValidator, loginPrestataireValidator } from "../validators/prestataire.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.get("/", getAllPrestataires);
router.get("/:id_presta", getPrestataire);
router.post("/register", registerPrestataireValidator, validate, register);
router.post("/login", loginPrestataireValidator, validate, login);
router.put("/:id_presta", registerPrestataireValidator, validate, updatePrestataire);
router.delete("/:id_presta", deletePrestataire);

export default router;
