export default {
    // App version, statically defined here, does not depend on environment
    app_version: process.env.npm_package_version,
    log_level: process.env.LOG_LEVEL,
    mongo_connection: process.env.MONGO_CONN,
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    postgres_connection: process.env.POSTGRES_CONN,
    redis_connection: process.env.REDIS_CONN,
    redis_enable: process.env.REDIS_ENABLE === "true" || false,
    redis_ttl: process.env.REDIS_DEFAULT_TTL,
};
