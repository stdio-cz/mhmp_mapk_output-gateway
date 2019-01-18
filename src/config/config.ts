module.exports = {
    app_version: 0.1,
    mongo_connection: process.env.MONGO_CONN,
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    log_level: process.env.LOG_LEVEL,
    postgres_connection: process.env.POSTGRES_CONN,
};
