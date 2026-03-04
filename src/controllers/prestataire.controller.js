import Prestataire from "../models/Prestataire.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const getAllPrestataires = async (req, res) => {
  try {
    const prestataires = await Prestataire.findAll();
    res.json(prestataires);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const getPrestataire = async (req, res) => {
  const { id_presta } = req.params;
  try {
    const prestataire = await Prestataire.findById(id_presta);
    if (!prestataire) {
      return res.status(404).json({ message: "Prestataire inexistant" });
    }
    res.json(prestataire);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const register = async (req, res) => {
  const { nom, prenom, email, password, telephone, adresse, code_postal, ville, siret } = req.body;

  try {
    const existing = await Prestataire.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPrestataire = await Prestataire.create({
      nom, prenom, email, password: hashedPassword, telephone, adresse, code_postal, ville, siret,
    });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Configuration serveur invalide" });
    }

    const token = jwt.sign(
      { id: newPrestataire.id_presta, email: newPrestataire.email, role: "prestataire" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "Prestataire créé avec succès",
      token,
      prestataire: { id: newPrestataire.id_presta, email: newPrestataire.email },
    });
  } catch (error) {
    console.error("REGISTER PRESTATAIRE ERROR:", error);
    if (error.code === "23505") {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const prestataire = await Prestataire.findByEmail(email);
    if (!prestataire) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const isValid = await bcrypt.compare(password, prestataire.mdp);
    if (!isValid) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const token = jwt.sign(
      { id: prestataire.id_presta, email: prestataire.email, role: "prestataire" },
      process.env.JWT_SECRET,
      { expiresIn: "1w" }
    );

    res.json({
      token,
      prestataire: { id: prestataire.id_presta, email: prestataire.email },
    });
  } catch (error) {
    console.error("LOGIN PRESTATAIRE ERROR:", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const updatePrestataire = async (req, res) => {
  const { id_presta } = req.params;
  const { nom, prenom, email, password, telephone, adresse, code_postal, ville, siret } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updated = await Prestataire.update({
      id_presta, nom, prenom, email, password: hashedPassword, telephone, adresse, code_postal, ville, siret,
    });

    if (!updated) {
      return res.status(404).json({ message: "Prestataire inexistant" });
    }

    res.json({
      message: "Prestataire mis à jour avec succès",
      prestataire: updated,
    });
  } catch (error) {
    console.error("UPDATE PRESTATAIRE ERROR:", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const deletePrestataire = async (req, res) => {
  const { id_presta } = req.params;

  try {
    await Prestataire.delete(id_presta);
    res.json({ message: "Prestataire supprimé avec succès" });
  } catch (error) {
    console.error("DELETE PRESTATAIRE ERROR:", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};
