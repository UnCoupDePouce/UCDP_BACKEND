import User from "../models/Users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

export const findAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const findById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur inexistant" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const register = async (req, res) => {
  const {
    nom,
    prenom,
    email,
    password,
    telephone,
    adresse,
    code_postal,
    ville,
    role,
    raison_sociale,
  } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Information déjà utilisée" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.register({
      nom,
      prenom,
      email,
      password: hashedPassword,
      telephone,
      adresse,
      code_postal,
      ville,
      role,
      raison_sociale,
    });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Configuration serveur invalide",
      });
    }

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return res.status(201).json({
      message: "Utilisateur créé avec succès",
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR :", error);

    if (error.code === "23505") {
      return res.status(409).json({ message: "Information déjà utilisée" });
    }

    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const isValid = await bcrypt.compare(password, user.mdp);
  if (!isValid) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const token = jwt.sign(
    { id: user.id_utilisateur, email: user.mail, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.json({ token, user });
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const isValid = await bcrypt.compare(password, user.mdp);
  if (!isValid) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  if (user.role !== "ADMIN") {
    return res.status(403).json({ message: "Accès refusé" });
  }

  const token = jwt.sign(
    { id: user.id_utilisateur, email: user.mail, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.json({ token, user });
};

export const updateUserAdmin = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, mail, role, telephone, adresse, code_postal, ville, raison_sociale, credits, id_entreprise } = req.body;
  if (!nom || !prenom || !mail || !role) {
    return res.status(400).json({ message: "Nom, prénom, email et rôle sont requis" });
  }
  try {
    const updated = await User.updateAdmin(id, { nom, prenom, mail, role, telephone, adresse, code_postal, ville, raison_sociale, credits, id_entreprise });
    if (!updated) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

//Todo : Rajouter, le role pour le modifier en cas de passage de CLIENT a PRESTATAIRE
export const updateUser = async (req, res) => {
  const {
    nom,
    prenom,
    email,
    password,
    telephone,
    adresse,
    code_postal,
    ville,
    raison_sociale,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.update({
      nom,
      prenom,
      email,
      password: hashedPassword,
      telephone,
      adresse,
      code_postal,
      ville,
      raison_sociale,
    });
    res.json({
      message: "Utilisateur mis à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};
