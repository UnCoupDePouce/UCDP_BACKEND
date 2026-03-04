import express from "express";
import { getAllMetiers, getMetier, createMetier, updateMetier, deleteMetier } from "../controllers/metier.controller.js";

const router = express.Router();

router.get("/", getAllMetiers);
router.get("/:id_metier", getMetier);
router.post("/", createMetier);
router.put("/:id_metier", updateMetier);
router.delete("/:id_metier", deleteMetier);

export default router;
