import MetierPresta from "../models/MetierPresta.js";

export const getMetiersByPresta = async (req, res) => {
  const { id_presta } = req.params;
  try {
    const metiers = await MetierPresta.findByPresta(id_presta);
    res.json(metiers);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const getPrestasByMetier = async (req, res) => {
  const { id_metier } = req.params;
  try {
    const prestas = await MetierPresta.findByMetier(id_metier);
    res.json(prestas);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const linkMetierPresta = async (req, res) => {
  const { id_metier, id_presta } = req.body;

  try {
    const link = await MetierPresta.create({ id_metier, id_presta });
    return res.status(201).json({
      message: "Liaison métier-prestataire créée avec succès",
      link,
    });
  } catch (error) {
    console.error("LINK METIER PRESTA ERROR:", error);
    if (error.code === "23505") {
      return res.status(409).json({ message: "Cette liaison existe déjà" });
    }
    if (error.code === "23503") {
      return res.status(404).json({ message: "Métier ou prestataire inexistant" });
    }
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const unlinkMetierPresta = async (req, res) => {
  const { id_metier, id_presta } = req.body;

  try {
    await MetierPresta.delete({ id_metier, id_presta });
    res.json({ message: "Liaison métier-prestataire supprimée avec succès" });
  } catch (error) {
    console.error("UNLINK METIER PRESTA ERROR:", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};
