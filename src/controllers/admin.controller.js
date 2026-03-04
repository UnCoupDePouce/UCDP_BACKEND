import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const getAdmin = async (req, res) => {
  const { id_admin } = req.params;
  try {
    const admin = await Admin.findById(id_admin);
    if (!admin) {
      return res.status(404).json({ message: "Admin inexistant" });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const createAdmin = async (req, res) => {
  const { nom, prenom, email, password } = req.body;

  try {
    const existing = await Admin.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({ nom, prenom, email, password: hashedPassword });

    return res.status(201).json({
      message: "Admin créé avec succès",
      admin: { id: newAdmin.id_admin, email: newAdmin.email },
    });
  } catch (error) {
    console.error("CREATE ADMIN ERROR:", error);
    if (error.code === "23505") {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findByEmail(email);
    if (!admin) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const isValid = await bcrypt.compare(password, admin.mdp);
    if (!isValid) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const token = jwt.sign(
      { id: admin.id_admin, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      admin: { id: admin.id_admin, email: admin.email },
    });
  } catch (error) {
    console.error("LOGIN ADMIN ERROR:", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const updateAdmin = async (req, res) => {
  const { id_admin } = req.params;
  const { nom, prenom, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedAdmin = await Admin.update({ id_admin, nom, prenom, email, password: hashedPassword });

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin inexistant" });
    }

    res.json({
      message: "Admin mis à jour avec succès",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("UPDATE ADMIN ERROR:", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const deleteAdmin = async (req, res) => {
  const { id_admin } = req.params;

  try {
    await Admin.delete(id_admin);
    res.json({ message: "Admin supprimé avec succès" });
  } catch (error) {
    console.error("DELETE ADMIN ERROR:", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};
