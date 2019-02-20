"use strict";

import * as Sequelize from "sequelize";
import CustomError from "./errors/CustomError";
import handleError from "./errors/ErrorHandler";
import log from "./Logger";
const config = require("../config/config");

export default class PostgresDatabase {

    // TODO: TSLint strictPropertyInitialization fails here - is it really wrong that the property is not initialized??
    private sequelize: Sequelize.Sequelize;
    private connectionString: string;

    public constructor() {
        this.connectionString = config.postgres_connection;
    }

    public connect = () => {
        try {
            if (this.sequelize) {
                return this.sequelize;
            }
            this.sequelize = new Sequelize(this.connectionString, {
                define: {
                    freezeTableName: true,
                    timestamps: false,
                },
                logging: require("debug")("sequelize"), // logging by debug
                operatorsAliases: false, // disable aliases
                pool: {
                    acquire: 60000,
                    idle: 10000,
                    max: 5,
                    min: 0,
                },
            });
            log.info("Connected to PostgresSQL DB!");
            return this.sequelize;
        } catch (err) {
            handleError(new CustomError("Error while connecting to PostgresSQL.", false,
                5001, err));
        }
    }
}

module.exports.sequelizeConnection = new PostgresDatabase().connect();
