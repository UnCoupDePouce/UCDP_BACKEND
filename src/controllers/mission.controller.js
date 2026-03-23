import Offre from "../models/Mission.js";

export const getAllOffres = async (req, res) => {
    try {
        const offres = await Offre.findAll();
        res.json(offres);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des offres" });
    }
};

export const getOffreById = async (req, res) => {
    try {
        const { id } = req.params;
        const offre = await Offre.findById(id);

        if (!offre) {
            return res.status(404).json({ message: "Offre introuvable" });
        }

        res.json(offre);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'offre" });
    }
};

export const addOffre = async (req, res) => {
    try {
        const { id_metier, description, prix, titre, localisation } = req.body;

        const id_utilisateur = req.user.id;

        if (!titre || !description || !localisation) {
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

        res.status(201).json(nouvelleOffre);
    } catch (error) {
        console.error("ERREUR ADD_OFFRE:", error);
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

        if (!offre) return res.status(404).json({ message: "Offre introuvable" });

        if (offre.id_utilisateur !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Non autorisé" });
        }

        const updated = await Offre.update(id, req.body);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Erreur modification" });
    }
};

export const fermerOffre = async (req, res) => {
    try {
        const { id } = req.params;
        const offre = await Offre.findById(id);

        if (offre.id_utilisateur !== req.user.id) {
            return res.status(403).json({ message: "Seul le client peut fermer son offre" });
        }

        await Offre.closeOffre(id);
        res.json({ message: "Offre clôturée" });
    } catch (error) {
        res.status(500).json({ message: "Erreur fermeture" });
    }
};

export const deleteOffre = async (req, res) => {
    try {
        const {id} = req.params;
        const offre = await Offre.findById(id);

        if (offre.id_utilisateur !== req.user.id) {
            return res.status(403).json({message: "Seul le client peut fermer son offre"});
        }

        await Offre.delete(id);
        res.json({message: "Offre supprimé"});
    } catch (error) {
        res.status(500).json({message: "Erreur fermeture"});
    }
};