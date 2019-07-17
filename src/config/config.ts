export default {
    // App version, statically defined here, does not depend on environment
    app_version: "0.0.1",
    colorful_logs: process.env.COLORFUL_LOGS,
    log_level: process.env.LOG_LEVEL,
    mongo_connection: process.env.MONGO_CONN,
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    postgres_connection: process.env.POSTGRES_CONN,
    redis_enable: process.env.REDIS_ENABLE,
    redis_host: process.env.REDIS_HOST,
    redis_port: process.env.REDIS_PORT,
    redis_ttl: process.env.REDIS_DEFAULT_TTL,
};
