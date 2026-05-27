import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500;
    
    const context = {
        errorName: err.name,
        statusCode,
    };

    logger.logError(err, req, context);

    res.status(statusCode).json({
        message: err.message || "Erreur serveur",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
};