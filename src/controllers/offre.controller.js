import Offre from "../models/Offre.js";

export const getAllOffres = async (req, res) => {
  try {
    const offres = await Offre.findAll();
    res.json(offres);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const getOffre = async (req, res) => {
  const { id_offre } = req.params;
  try {
    const offre = await Offre.findById(id_offre);
    if (!offre) {
      return res.status(404).json({ message: "Offre inexistante" });
    }
    res.json(offre);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const getOffresByPresta = async (req, res) => {
  const { id_presta } = req.params;
  try {
    const offres = await Offre.findByPresta(id_presta);
    res.json(offres);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const createOffre = async (req, res) => {
  const { titre, description, prix, id_presta } = req.body;

  try {
    const newOffre = await Offre.create({ titre, description, prix, id_presta });
    return res.status(201).json({
      message: "Offre créée avec succès",
      offre: newOffre,
    });
  } catch (error) {
    console.error("CREATE OFFRE ERROR:", error);
    if (error.code === "23503") {
      return res.status(404).json({ message: "Prestataire inexistant" });
    }
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const updateOffre = async (req, res) => {
  const { id_offre } = req.params;
  const { titre, description, prix, statut } = req.body;

  try {
    const updatedOffre = await Offre.update({ id_offre, titre, description, prix, statut });
    if (!updatedOffre) {
      return res.status(404).json({ message: "Offre inexistante" });
    }
    res.json({
      message: "Offre mise à jour avec succès",
      offre: updatedOffre,
    });
  } catch (error) {
    console.error("UPDATE OFFRE ERROR:", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const deleteOffre = async (req, res) => {
  const { id_offre } = req.params;

  try {
    await Offre.delete(id_offre);
    res.json({ message: "Offre supprimée avec succès" });
  } catch (error) {
    console.error("DELETE OFFRE ERROR:", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};
