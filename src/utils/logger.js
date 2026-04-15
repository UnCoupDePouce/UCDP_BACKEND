const logs = [];

const logError = (error, req = null) => {
    const entry = {
        id: Date.now() + Math.random().toString(36).substring(2, 8),
        message: error?.message || "Erreur inconnue",
        stack: error.stack,
        route: req?.originalUrl || null,
        method: req?.method || null,
        date: new Date(),
    };

    logs.push(entry);

    if (logs.length > 200) logs.shift();
};

const getLogs = (filters = {}) => {
    let result = logs.filter(log => {
        if (filters.route && !log.route?.includes(filters.route)) return false;
        if (filters.method && log.method !== filters.method.toUpperCase()) return false;

        if (
            filters.search &&
            !log.message?.toLowerCase().includes(filters.search.toLowerCase())
        ) return false;

        if (filters.from && new Date(log.date) < new Date(filters.from)) return false;
        if (filters.to && new Date(log.date) > new Date(filters.to)) return false;

        return true;
    });

    if (filters.sort === "desc") {
        result = result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
        result = result.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
        total: result.length,
        page,
        limit,
        data: result.slice(start, end)
    };
};

export default {
    logError,
    getLogs
};