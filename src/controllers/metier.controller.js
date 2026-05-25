import Metier from "../models/Metier.js";
import logger from "../utils/logger.js";

export const getAllMetier = async (req, res) => {
    try {
        const offres = await Metier.getAll();
        logger.logSuccess("Métiers récupérés", req, 200);
        res.json(offres);
    } catch (error) {
        logger.logError(error, req);
        res.status(500).json({ message: "Erreur lors de la récupération des offres" });
    }
};

