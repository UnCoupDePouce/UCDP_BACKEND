import Metier from "../models/Metier.js";
import logger from "../utils/logger.js";

export const getAllMetier = async (req, res) => {
    try {
        const metiers = await Metier.getAll();
        logger.logSuccess(`Métiers récupérés: ${metiers?.length || 0} résultats`, req, 200);
        res.json(metiers);
    } catch (error) {
        logger.logError(error, req, {operation: "getAllMetier"});
        res.status(500).json({ message: "Erreur lors de la récupération des métiers" });
    }
};
