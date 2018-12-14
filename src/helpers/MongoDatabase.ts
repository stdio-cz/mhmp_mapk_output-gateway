import * as mongoose from "mongoose";
import CustomError from "./errors/CustomError";
import handleError from "./errors/ErrorHandler";
import log from "./Logger";

export default class MongoDatabase {
    private connectionString: string;

    constructor(uri: string) {
        this.connectionString = uri;
    }

    public connect = async () => {
        try {
            await mongoose.connect(this.connectionString, {
                autoReconnect: true,
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