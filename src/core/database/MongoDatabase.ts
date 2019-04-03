import * as mongoose from "mongoose";
import config from "../../config/config";
import { CustomError } from "../errors";
import { handleError } from "../errors";
import { log } from "../Logger";

export class MongoDatabase {
    private connectionString: string;

    constructor() {
        this.connectionString = config.mongo_connection || "mongodb://localhost:27017";
    }

    public connect = async () => {
        try {
            await mongoose.connect(this.connectionString, {
                autoReconnect: true,
                useCreateIndex: true,
                useNewUrlParser: true,
            });
        } catch (err) {
            log.error("Could not connect to " + this.connectionString);
            throw new CustomError("Error while connecting to Mongo DB", false, 5001, err);
        }
        log.info("Connected to Mongo DB!");
        mongoose.connection.on("disconnected", () => {
            handleError(new CustomError("Database disconnected", false, 5002));
        });
    }
}

const mongooseConnection = new MongoDatabase().connect();

export { mongooseConnection };
