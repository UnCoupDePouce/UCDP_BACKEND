import { body } from "express-validator";

export const createAdminValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email requis")
    .isEmail().withMessage("Email invalide"),

  body("password")
    .notEmpty().withMessage("Mot de passe requis")
    .isLength({ min: 8 }).withMessage("Mot de passe trop court")
    .matches(/[a-z]/).withMessage("1 minuscule requise")
    .matches(/[A-Z]/).withMessage("1 majuscule requise")
    .matches(/\d/).withMessage("1 chiffre requis")
    .matches(/[^A-Za-z0-9]/).withMessage("1 caractère spécial requis"),

  body("nom").trim().notEmpty().withMessage("Nom requis"),
  body("prenom").trim().notEmpty().withMessage("Prénom requis"),
];

export const loginAdminValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email requis")
    .isEmail().withMessage("Email invalide"),

  body("password").notEmpty().withMessage("Mot de passe requis"),
];
