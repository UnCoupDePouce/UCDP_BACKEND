import Transaction from "../models/Transaction.js";

export const getTransaction = async (req, res) => {
  const { id_transaction } = req.params;
  try {
    const transaction = await Transaction.findById(id_transaction);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction inexistante" });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const getTransactionsByUtilisateur = async (req, res) => {
  const { id_utilisateur } = req.params;
  try {
    const transactions = await Transaction.findByUtilisateur(id_utilisateur);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const getTransactionsByPresta = async (req, res) => {
  const { id_presta } = req.params;
  try {
    const transactions = await Transaction.findByPresta(id_presta);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const createTransaction = async (req, res) => {
  const { montant, id_offre, id_utilisateur } = req.body;

  try {
    const newTransaction = await Transaction.create({ montant, id_offre, id_utilisateur });
    return res.status(201).json({
      message: "Transaction créée avec succès",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("CREATE TRANSACTION ERROR:", error);
    if (error.code === "23503") {
      return res.status(404).json({ message: "Offre ou utilisateur inexistant" });
    }
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const updateStatutTransaction = async (req, res) => {
  const { id_transaction } = req.params;
  const { statut } = req.body;

  try {
    const updated = await Transaction.updateStatut({ id_transaction, statut });
    if (!updated) {
      return res.status(404).json({ message: "Transaction inexistante" });
    }
    res.json({
      message: "Statut mis à jour avec succès",
      transaction: updated,
    });
  } catch (error) {
    console.error("UPDATE TRANSACTION ERROR:", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id_transaction } = req.params;

  try {
    await Transaction.delete(id_transaction);
    res.json({ message: "Transaction supprimée avec succès" });
  } catch (error) {
    console.error("DELETE TRANSACTION ERROR:", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};
