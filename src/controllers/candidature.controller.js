import { candidatureModel } from "../models/candidature.js";

export const postulerOffre = async (req, res) => {
    const { id_offre, id_client } = req.body;
    const id_prestataire = req.user.id;

    try {
        const alreadyApplied = await candidatureModel.checkExisting(id_prestataire, id_offre);
        if (alreadyApplied) {
            return res.status(400).json({ message: "Vous avez déjà postulé à cette mission." });
        }

        // 2. Création
        const nouvelleCandidature = await candidatureModel.create(
            id_prestataire,
            id_offre,
            id_client
        );

        res.status(201).json({
            message: "Candidature envoyée avec succès !",
            data: nouvelleCandidature
        });

    } catch (error) {
        console.error("Erreur postulation:", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la postulation." });
    }
};

export const getMesCandidatures = async (req, res) => {
    // On utilise la même clé que pour la postulation (id ou id_utilisateur)
    const id_prestataire = req.user?.id || req.user?.id_utilisateur;

    try {
        const candidatures = await candidatureModel.getByPrestataire(id_prestataire);
        res.status(200).json(candidatures);
    } catch (error) {
        console.error("Erreur récup candidatures:", error);
        res.status(500).json({ message: "Erreur lors de la récupération de vos candidatures." });
    }
};