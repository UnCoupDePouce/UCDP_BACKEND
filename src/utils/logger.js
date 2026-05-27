const logs = [];

const getRequestContext = (req) => {
    if (!req) return {};
    return {
        ip: req.ip || req.connection?.remoteAddress || "unknown",
        userId: req.user?.id || null,
        queryParams: req.query || {},
        body: sanitizeBody(req.body),
        headers: sanitizeHeaders(req.headers),
    };
};

const sanitizeBody = (body) => {
    if (!body) return {};
    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
    sensitiveFields.forEach(field => {
        if (sanitized[field]) sanitized[field] = '***REDACTED***';
    });
    return sanitized;
};

const sanitizeHeaders = (headers) => {
    if (!headers) return {};
    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    sensitiveHeaders.forEach(header => {
        if (sanitized[header]) sanitized[header] = '***REDACTED***';
    });
    return sanitized;
};

const logError = (error, req = null, context = {}) => {
    const entry = {
        id: Date.now() + Math.random().toString(36).substring(2, 8),
        message: error?.message || "Erreur inconnue",
        stack: error.stack,
        route: req?.originalUrl || null,
        method: req?.method || null,
        level: "ERROR",
        statusCode: context.statusCode || 500,
        ...getRequestContext(req),
        ...context,
        date: new Date(),
    };

    logs.push(entry);
    console.error(`[ERROR] ${entry.method} ${entry.route} - ${entry.message}`, { stack: entry.stack });

    if (logs.length > 300) logs.shift();
};

const logInfo = (message, req = null, data = null, context = {}) => {
    const entry = {
        id: Date.now() + Math.random().toString(36).substring(2, 8),
        message,
        route: req?.originalUrl || null,
        method: req?.method || null,
        level: "INFO",
        data,
        ...getRequestContext(req),
        ...context,
        date: new Date(),
    };

    logs.push(entry);
    console.log(`[INFO] ${entry.method} ${entry.route} - ${message}`);

    if (logs.length > 300) logs.shift();
};

const logSuccess = (message, req = null, statusCode = 200, context = {}) => {
    const entry = {
        id: Date.now() + Math.random().toString(36).substring(2, 8),
        message,
        route: req?.originalUrl || null,
        method: req?.method || null,
        level: "SUCCESS",
        statusCode,
        ...getRequestContext(req),
        ...context,
        date: new Date(),
    };

    logs.push(entry);
    console.log(`[SUCCESS] ${entry.method} ${entry.route} - ${message} (${statusCode})`);

    if (logs.length > 300) logs.shift();
};

const logClientError = (message, req = null, statusCode = 400, context = {}) => {
    const entry = {
        id: Date.now() + Math.random().toString(36).substring(2, 8),
        message,
        route: req?.originalUrl || null,
        method: req?.method || null,
        level: "CLIENT_ERROR",
        statusCode,
        ...getRequestContext(req),
        ...context,
        date: new Date(),
    };

    logs.push(entry);
    console.warn(`[CLIENT_ERROR] ${entry.method} ${entry.route} - ${message} (${statusCode})`);

    if (logs.length > 300) logs.shift();
};

const logDatabase = (error, query = "", req = null, context = {}) => {
    const entry = {
        id: Date.now() + Math.random().toString(36).substring(2, 8),
        message: `Database Error: ${error?.message || "Unknown error"}`,
        errorCode: error?.code,
        query: query,
        stack: error?.stack,
        route: req?.originalUrl || null,
        method: req?.method || null,
        level: "DATABASE_ERROR",
        statusCode: 500,
        ...getRequestContext(req),
        ...context,
        date: new Date(),
    };

    logs.push(entry);
    console.error(`[DATABASE_ERROR] ${entry.method} ${entry.route} - ${error?.message}`, { query, code: error?.code });

    if (logs.length > 300) logs.shift();
};

const logValidation = (message, req = null, errors = [], statusCode = 400) => {
    const entry = {
        id: Date.now() + Math.random().toString(36).substring(2, 8),
        message: `Validation Error: ${message}`,
        validationErrors: errors,
        route: req?.originalUrl || null,
        method: req?.method || null,
        level: "VALIDATION_ERROR",
        statusCode,
        ...getRequestContext(req),
        date: new Date(),
    };

    logs.push(entry);
    console.warn(`[VALIDATION_ERROR] ${entry.method} ${entry.route} - ${message}`, errors);

    if (logs.length > 300) logs.shift();
};

const logWarning = (message, req = null, context = {}) => {
    const entry = {
        id: Date.now() + Math.random().toString(36).substring(2, 8),
        message,
        route: req?.originalUrl || null,
        method: req?.method || null,
        level: "WARNING",
        ...getRequestContext(req),
        ...context,
        date: new Date(),
    };

    logs.push(entry);
    console.warn(`[WARNING] ${entry.method} ${entry.route} - ${message}`);

    if (logs.length > 300) logs.shift();
};

const getLogs = (filters = {}) => {
    let result = logs.filter(log => {
        if (filters.route && !log.route?.includes(filters.route)) return false;
        if (filters.method && log.method !== filters.method.toUpperCase()) return false;
        if (filters.level && log.level !== filters.level) return false;

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

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        logError(error, req);
        next(error);
    });
};

export default {
    logError,
    logInfo,
    logSuccess,
    logClientError,
    logDatabase,
    logValidation,
    logWarning,
    getLogs,
    asyncHandler
};