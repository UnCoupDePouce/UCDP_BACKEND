import express from "express";
import { getAllOffres, getOffre, getOffresByPresta, createOffre, updateOffre, deleteOffre } from "../controllers/offre.controller.js";

const router = express.Router();

router.get("/", getAllOffres);
router.get("/:id_offre", getOffre);
router.get("/presta/:id_presta", getOffresByPresta);
router.post("/", createOffre);
router.put("/:id_offre", updateOffre);
router.delete("/:id_offre", deleteOffre);

export default router;
