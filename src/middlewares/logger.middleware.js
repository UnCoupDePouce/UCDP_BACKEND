import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
    logger.logError(err, req);

    res.status(500).json({
        message: "Erreur serveur"
    });
};