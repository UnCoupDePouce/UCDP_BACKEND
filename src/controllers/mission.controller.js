import Offre from "../models/Mission.js";
import logger from "../utils/logger.js";

export const getAllOffres = async (req, res) => {
    try {
        const { ville } = req.query;

        const options = {};
        if (ville) {
            options.where = {
                ville: ville
            };
        }

        const offres = await Offre.findAll(options);
        logger.logSuccess(`Offres récupérées (${offres?.length || 0} résultats)`, req, 200);
        res.json(offres);
    } catch (error) {
        logger.logError(error, req, {operation: "getAllOffres"});
        res.status(500).json({ message: "Erreur lors de la récupération des offres" });
    }
};

export const getOffreById = async (req, res) => {
    try {
        const { id } = req.params;
        const offre = await Offre.findById(id);

        if (!offre) {
            logger.logClientError(`Offre introuvable: ${id}`, req, 404);
            return res.status(404).json({ message: "Offre introuvable" });
        }

        logger.logSuccess(`Offre récupérée: ${id}`, req, 200);
        res.json(offre);
    } catch (error) {
        logger.logError(error, req, {operation: "getOffreById", offreId: req.params.id});
        res.status(500).json({ message: "Erreur lors de la récupération de l'offre" });
    }
};

export const addOffre = async (req, res) => {
    try {
        const { id_metier, description, prix, titre, localisation } = req.body;
        const id_utilisateur = req.user?.id;

        if (!id_utilisateur) {
            logger.logClientError("Utilisateur non authentifié", req, 401);
            return res.status(401).json({ message: "Authentification requise" });
        }

        if (!titre || !description || !localisation) {
            logger.logValidation("Paramètres manquants pour créer une offre", req, [
                {field: "titre", message: "required"},
                {field: "description", message: "required"},
                {field: "localisation", message: "required"}
            ], 400);
            return res.status(400).json({ message: "Titre, description et localisation sont obligatoires." });
        }

        const nouvelleOffre = await Offre.create({
            id_utilisateur,
            id_metier: id_metier || null,
            description,
            prix: parseInt(prix) || 0,
            titre,
            localisation,
            date_offre: new Date(),
            statut: false
        });

        logger.logSuccess(`Offre créée: ${titre}`, req, 201);
        res.status(201).json(nouvelleOffre);
    } catch (error) {
        logger.logError(error, req, {operation: "addOffre", titre: req.body?.titre});
        res.status(500).json({
            message: "Erreur lors de la création de l'offre",
            error: error.message
        });
    }
};

export const updateOffre = async (req, res) => {
    try {
        const { id } = req.params;
        const offre = await Offre.findById(id);

        if (!offre) {
            logger.logClientError(`Offre introuvable: ${id}`, req, 404);
            return res.status(404).json({ message: "Offre introuvable" });
        }

        if (offre.id_utilisateur !== req.user?.id && req.user?.role !== 'ADMIN') {
            logger.logClientError(`Accès non autorisé: ${id}`, req, 403);
            return res.status(403).json({ message: "Non autorisé" });
        }

        const updated = await Offre.update(id, req.body);
        logger.logSuccess(`Offre mise à jour: ${id}`, req, 200);
        res.json(updated);
    } catch (error) {
        logger.logError(error, req, {operation: "updateOffre", offreId: req.params.id});
        res.status(500).json({ message: "Erreur modification" });
    }
};

export const fermerOffre = async (req, res) => {
    try {
        const { id } = req.params;
        const offre = await Offre.findById(id);

        if (!offre) {
            logger.logClientError(`Offre introuvable: ${id}`, req, 404);
            return res.status(404).json({ message: "Offre introuvable" });
        }

        if (offre.id_utilisateur !== req.user?.id) {
            logger.logClientError(`Accès non autorisé pour fermer: ${id}`, req, 403);
            return res.status(403).json({ message: "Seul le client peut fermer son offre" });
        }

        await Offre.closeOffre(id);
        logger.logSuccess(`Offre fermée: ${id}`, req, 200);
        res.json({ message: "Offre clôturée" });
    } catch (error) {
        logger.logError(error, req, {operation: "fermerOffre", offreId: req.params.id});
        res.status(500).json({ message: "Erreur fermeture" });
    }
};

export const deleteOffre = async (req, res) => {
    try {
        const {id} = req.params;
        const offre = await Offre.findById(id);

        if (!offre) {
            logger.logClientError(`Offre introuvable: ${id}`, req, 404);
            return res.status(404).json({ message: "Offre introuvable" });
        }

        if (offre.id_utilisateur !== req.user?.id) {
            logger.logClientError(`Accès non autorisé pour supprimer: ${id}`, req, 403);
            return res.status(403).json({message: "Seul le client peut fermer son offre"});
        }

        await Offre.delete(id);
        logger.logSuccess(`Offre supprimée: ${id}`, req, 200);
        res.json({message: "Offre supprimée"});
    } catch (error) {
        logger.logError(error, req, {operation: "deleteOffre", offreId: req.params.id});
        res.status(500).json({message: "Erreur suppression"});
    }
};