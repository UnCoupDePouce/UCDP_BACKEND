import User from "../models/Users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
import logger from "../utils/logger.js";

dotenv.config();

export const findById = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            logger.logClientError(`Utilisateur inexistant (ID: ${id})`, req, 404);
            return res.status(404).json({message: "Utilisateur inexistant"});
        }
        logger.logSuccess(`Utilisateur récupéré: ${user.id_utilisateur}`, req, 200);
        res.json(user);
    } catch (error) {
        logger.logError(error, req, {operation: "findById", userId: id});
        res.status(500).json({message: "Erreur du serveur"});
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
            logger.logValidation("Email et mot de passe requis", req, [{field: "email", message: "required"}, {field: "password", message: "required"}], 400);
            return res.status(400).json({message: "Email et mot de passe requis"});
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            logger.logClientError(`Email déjà utilisé: ${email}`, req, 409);
            return res.status(409).json({message: "Information déjà utilisée"});
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
            date_creation: new Date(),
        });

        if (!process.env.JWT_SECRET) {
            logger.logError(new Error("JWT_SECRET non configuré"), req, {severity: "CRITICAL"});
            return res.status(500).json({
                message: "Configuration serveur invalide",
            });
        }

        const token = jwt.sign(
            {id: newUser.id, email: newUser.email},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );

        logger.logSuccess(`Utilisateur créé: ${email}`, req, 201);
        return res.status(201).json({
            message: "Utilisateur créé avec succès",
            token,
            user: {
                id_utilisateur: newUser.id,
                prenom: newUser.prenom,
                nom: newUser.nom,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        if (error.code === "23505") {
            logger.logClientError(`Email déjà utilisé (DB constraint): ${email}`, req, 409);
            return res.status(409).json({message: "Information déjà utilisée"});
        }

        logger.logError(error, req, {operation: "register", email, errorCode: error.code});
        return res.status(500).json({message: "Erreur interne du serveur"});
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        if (!email || !password) {
            logger.logValidation("Email et mot de passe requis pour login", req, [], 400);
            return res.status(401).json({message: "Identifiants invalides"});
        }

        const user = await User.findByEmail(email);
        if (!user) {
            logger.logClientError(`Email inexistant: ${email}`, req, 401);
            return res.status(401).json({message: "Identifiants invalides"});
        }

        const isValid = await bcrypt.compare(password, user.mdp);
        if (!isValid) {
            logger.logWarning(`Mot de passe invalide pour: ${email}`, req, {attemptEmail: email});
            return res.status(401).json({message: "Identifiants invalides"});
        }

        if (!process.env.JWT_SECRET) {
            logger.logError(new Error("JWT_SECRET non configuré"), req, {severity: "CRITICAL"});
            return res.status(500).json({message: "Erreur serveur"});
        }

        const token = jwt.sign(
            {id: user.id_utilisateur, email: user.mail},
            process.env.JWT_SECRET,
            {expiresIn: "1 Weeks"}
        );

        logger.logSuccess(`Connexion: ${email}`, req, 200);
        res.json({
            token,
            user
        });
    } catch (error) {
        logger.logError(error, req, {operation: "login", email});
        res.status(500).json({message: "Erreur du serveur"});
    }
};

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
    const userId = req.params.id || req.user?.id;

    try {
        if (!userId) {
            logger.logClientError("ID utilisateur manquant", req, 400);
            return res.status(400).json({message: "ID utilisateur requis"});
        }

        if (password) {
            var hashedPassword = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.update({
            id: userId,
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

        if (!updatedUser) {
            logger.logClientError(`Utilisateur non trouvé: ${userId}`, req, 404);
            return res.status(404).json({message: "Utilisateur non trouvé"});
        }

        logger.logSuccess(`Utilisateur mis à jour: ${userId}`, req, 200);
        res.json({
            message: "Utilisateur mis à jour avec succès",
            user: updatedUser,
        });
    } catch (error) {
        logger.logError(error, req, {operation: "updateUser", userId});
        res.status(500).json({message: "Erreur du serveur"});
    }
};

export const findAll = async (req, res) => {
    try {
        const users = await User.findAll();
        logger.logSuccess(`Tous les utilisateurs récupérés`, req, 200);
        res.json(users);
    } 
    catch (error) {
            logger.logError(error, req, {operation: "findAll"});
            res.status(500).json({message: "Erreur du serveur"});
    }
};