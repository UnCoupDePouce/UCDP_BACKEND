import Metier from "../models/Metier.js";

export const getAllMetiers = async (req, res) => {
  try {
    const metiers = await Metier.findAll();
    res.json(metiers);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const getMetier = async (req, res) => {
  const { id_metier } = req.params;
  try {
    const metier = await Metier.findById(id_metier);
    if (!metier) {
      return res.status(404).json({ message: "Métier inexistant" });
    }
    res.json(metier);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const createMetier = async (req, res) => {
  const { nom } = req.body;

  try {
    const newMetier = await Metier.create({ nom });
    return res.status(201).json({
      message: "Métier créé avec succès",
      metier: newMetier,
    });
  } catch (error) {
    console.error("CREATE METIER ERROR:", error);
    if (error.code === "23505") {
      return res.status(409).json({ message: "Ce métier existe déjà" });
    }
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const updateMetier = async (req, res) => {
  const { id_metier } = req.params;
  const { nom } = req.body;

  try {
    const updatedMetier = await Metier.update({ id_metier, nom });
    if (!updatedMetier) {
      return res.status(404).json({ message: "Métier inexistant" });
    }
    res.json({
      message: "Métier mis à jour avec succès",
      metier: updatedMetier,
    });
  } catch (error) {
    console.error("UPDATE METIER ERROR:", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const deleteMetier = async (req, res) => {
  const { id_metier } = req.params;

  try {
    await Metier.delete(id_metier);
    res.json({ message: "Métier supprimé avec succès" });
  } catch (error) {
    console.error("DELETE METIER ERROR:", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};
