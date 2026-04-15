import logger from "../utils/logger.js";

export function getLogs(req, res, next) {
    try {
        const filters = {
            route: req.query.route,
            method: req.query.method,
            search: req.query.search,
            from: req.query.from,
            to: req.query.to,
            sort: req.query.sort,
            page: req.query.page,
            limit: req.query.limit
        };

        // Exemple de réponse :
        // {
        //   "total": 42,
        //   "page": 1,
        //   "limit": 10,
        //   "data": [
        //     {
        //       "message": "Database error",
        //       "route": "/metier",
        //       "method": "GET",
        //       "date": "2026-04-15T10:00:00.000Z"
        //     }
        //   ]
        // }

        const logs = logger.getLogs(filters);
        res.json(logs);

    } catch (error) {
        next(error);
    }
}
