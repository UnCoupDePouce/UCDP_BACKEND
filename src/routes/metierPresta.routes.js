import express from "express";
import { getMetiersByPresta, getPrestasByMetier, linkMetierPresta, unlinkMetierPresta } from "../controllers/metierPresta.controller.js";

const router = express.Router();

router.get("/presta/:id_presta", getMetiersByPresta);
router.get("/metier/:id_metier", getPrestasByMetier);
router.post("/", linkMetierPresta);
router.delete("/", unlinkMetierPresta);

export default router;
