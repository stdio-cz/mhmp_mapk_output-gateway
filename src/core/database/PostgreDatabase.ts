import { CustomError, ErrorHandler } from "@golemio/errors";
import * as Sequelize from "sequelize";
import config from "../../config/config";
import { log } from "../Logger";

/**
 * Class for connection to PostgreSQL database. Using sequelize https://www.npmjs.com/package/sequelize
 */
class PostgresDatabase {

    // TODO: TSLint strictPropertyInitialization fails here - is it really wrong that the property is not initialized??
    private sequelize: Sequelize.Sequelize;
    private connectionString: string;

    public constructor() {
        this.connectionString = config.postgres_connection || "";
    }

    /** Connects to db */
    public connect = (connectionString?: string) => {
        try {
            if (this.sequelize) {
                return this.sequelize;
            }
            this.sequelize = new Sequelize(connectionString || this.connectionString, {
                define: {
                    freezeTableName: true,
                    timestamps: false,
                },
                logging: log.silly, // logging by debug
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
            ErrorHandler.handle(new CustomError("Error while connecting to PostgresSQL.", false, "PostgreDatabase",
                5001, err));
            return this.sequelize;
        }
    }
}

const sequelizeConnection = new PostgresDatabase().connect(config.postgres_connection || "");
const sequelizeReadOnlyConnection = new PostgresDatabase().connect(config.postgres_read_only_connection || "");

export {
    sequelizeConnection,
    sequelizeReadOnlyConnection,
};
