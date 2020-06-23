const getPaginationMaxLimit = (): number => {
    if (process.env.PAGINATION_MAX_LIMIT) {
        const parsed = parseInt(process.env.PAGINATION_MAX_LIMIT, 10);
        if (!isNaN(parsed)) {
            return parsed;
        }
    }

    return 10000;
};

const getMongoTimeout = (): number => {
    if (process.env.MONGO_TIMEOUT) {
        const parsed = parseInt(process.env.MONGO_TIMEOUT, 10);
        if (!isNaN(parsed)) {
            return parsed;
        }
    }

    return 30000;
};

export default {
    // App version, statically defined here, does not depend on environment
    app_version: process.env.npm_package_version,
    log_level: process.env.LOG_LEVEL,
    mongo_connection: process.env.MONGO_CONN,
    mongo_timeout: getMongoTimeout(),
    node_env: process.env.NODE_ENV,
    pagination_max_limit: getPaginationMaxLimit(),
    port: process.env.PORT,
    postgres_connection: process.env.POSTGRES_CONN,
    redis_connection: process.env.REDIS_CONN,
    redis_enable: process.env.REDIS_ENABLE === "true" || false,
    redis_ttl: process.env.REDIS_DEFAULT_TTL,
    sentry_dsn: process.env.SENTRY_DSN,
    sentry_enable: process.env.SENTRY_ENABLE === "true" || false,
};
