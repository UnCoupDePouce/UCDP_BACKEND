import { candidatureModel } from "../models/Candidature.js";
import Message from "../models/Message.js";
import { getIO } from "../utils/socket.js";
import logger from "../utils/logger.js";

export const postulerOffre = async (req, res) => {
    const { id_offre, id_client } = req.body;
    const id_prestataire = req.user?.id;

    try {
        if (!id_prestataire) {
            logger.logClientError("Utilisateur non authentifié", req, 401);
            return res.status(401).json({ message: "Authentification requise" });
        }

        const alreadyApplied = await candidatureModel.checkExisting(id_prestataire, id_offre);
        if (alreadyApplied) {
            logger.logClientError(`Candidature déjà existante: ${id_offre}`, req, 400);
            return res.status(400).json({ message: "Vous avez déjà postulé à cette mission." });
        }

        const nouvelleCandidature = await candidatureModel.create(
            id_prestataire,
            id_offre,
            id_client
        );

        const messageAuto = "Bonjour, je viens de postuler à votre annonce. N'hésitez pas à me contacter !";
        const savedMessage = await Message.save(messageAuto, id_prestataire, id_client);

        const io = getIO();
        if (io) {
            io.to(`user_${id_client}`).emit("new_message", savedMessage);
        }

        logger.logSuccess(`Candidature postulée: ${id_offre}`, req, 201);
        res.status(201).json({
            message: "Candidature envoyée avec succès !",
            data: nouvelleCandidature
        });

    } catch (error) {
        logger.logError(error, req, {operation: "postulerOffre", id_offre, id_prestataire});
        res.status(500).json({ message: "Une erreur est survenue lors de la postulation." });
    }
};

export const getCandidaturesClient = async (req, res) => {
    const id_client = req.user?.id || req.user?.id_utilisateur;

    try {
        const candidatures = await candidatureModel.getByClient(id_client);
        logger.logSuccess(`Candidatures client: ${candidatures?.length || 0} résultats`, req, 200);
        res.status(200).json(candidatures);
    } catch (error) {
        logger.logError(error, req, {operation: "getCandidaturesClient", id_client});
        res.status(500).json({ message: "Erreur lors de la récupération des candidatures." });
    }
};

export const validerCandidature = async (req, res) => {
    const { id } = req.params;
    const id_client = req.user?.id || req.user?.id_utilisateur;

    try {
        const candidature = await candidatureModel.valider(id);
        if (!candidature) {
            logger.logClientError(`Candidature introuvable: ${id}`, req, 404);
            return res.status(404).json({ message: "Candidature introuvable ou déjà traitée." });
        }

        const id_prestataire = candidature.id_prestataire;
        const messageAuto = "Félicitations ! Votre candidature a été acceptée. Nous vous contacterons prochainement pour les prochaines étapes.";
        const savedMessage = await Message.save(messageAuto, id_client, id_prestataire);

        const io = getIO();
        if (io) {
            io.to(`user_${id_prestataire}`).emit("new_message", savedMessage);
        }

        logger.logSuccess(`Candidature validée: ${id}`, req, 200);
        res.status(200).json({
            message: "Candidature validée avec succès.",
            data: candidature
        });

    } catch (error) {
        logger.logError(error, req, {operation: "validerCandidature", candidatureId: id});
        res.status(500).json({ message: "Erreur lors de la validation de la candidature." });
    }
};

export const refuserCandidature = async (req, res) => {
    const { id } = req.params;
    const id_client = req.user?.id || req.user?.id_utilisateur;

    try {
        const candidature = await candidatureModel.refuser(id);
        if (!candidature) {
            logger.logClientError(`Candidature introuvable: ${id}`, req, 404);
            return res.status(404).json({ message: "Candidature introuvable ou déjà traitée." });
        }

        const id_prestataire = candidature.id_prestataire;
        const messageAuto = "Nous avons bien examiné votre candidature, mais nous n'y donnons pas suite. Merci de l'intérêt porté à notre annonce.";
        const savedMessage = await Message.save(messageAuto, id_client, id_prestataire);

        const io = getIO();
        if (io) {
            io.to(`user_${id_prestataire}`).emit("new_message", savedMessage);
        }

        logger.logSuccess(`Candidature refusée: ${id}`, req, 200);
        res.status(200).json({ message: "Candidature refusée.", data: candidature });

    } catch (error) {
        logger.logError(error, req, {operation: "refuserCandidature", candidatureId: id});
        res.status(500).json({ message: "Erreur lors du refus de la candidature." });
    }
};

export const getCandidatures = async (req, res) => {
    const id_utilisateur = req.user?.id || req.user?.id_utilisateur;
    const role = req.query?.role;

    try {
        let candidatures = [];

        if (role === 'ADMIN') {
            candidatures = await candidatureModel.get({});
        }
        else if (role === 'CLIENT') {
            candidatures = await candidatureModel.get({ id_client: id_utilisateur });
        } else if (role === 'PRESTATAIRE') {
            candidatures = await candidatureModel.get({ id_prestataire: id_utilisateur });
        } else {
            logger.logClientError(`Rôle non autorisé: ${role}`, req, 403);
            return res.status(403).json({ message: "Rôle non autorisé." });
        }

        logger.logSuccess(`Candidatures récupérées: ${candidatures?.length || 0} résultats (${role})`, req, 200);
        res.status(200).json(candidatures);

    } catch (error) {
        logger.logError(error, req, {operation: "getCandidatures", role, id_utilisateur});
        res.status(500).json({ message: "Erreur lors de la récupération des candidatures." });
    }
};