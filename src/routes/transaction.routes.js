import express from "express";
import { getTransaction, getTransactionsByUtilisateur, getTransactionsByPresta, createTransaction, updateStatutTransaction, deleteTransaction } from "../controllers/transaction.controller.js";

const router = express.Router();

router.get("/:id_transaction", getTransaction);
router.get("/utilisateur/:id_utilisateur", getTransactionsByUtilisateur);
router.get("/presta/:id_presta", getTransactionsByPresta);
router.post("/", createTransaction);
router.patch("/:id_transaction/statut", updateStatutTransaction);
router.delete("/:id_transaction", deleteTransaction);

export default router;
