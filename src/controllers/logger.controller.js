import logger from "../utils/logger.js";

export function getLogs(req, res) {
    try {
        const filters = {
            route: req.query.route,
            method: req.query.method,
            search: req.query.search,
            from: req.query.from,
            to: req.query.to
        };

        const logs = logger.getLogs(filters);

        res.json(logs);
    } catch (error) {
        logger.logError(error, req);
        res.status(500).json({ message: "Failed to retrieve logs" });
    }
}