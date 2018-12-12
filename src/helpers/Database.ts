import * as mongoose from "mongoose";
import CustomError from "./errors/CustomError";
import handleError from "./errors/ErrorHandler";
import log from "./Logger";

export default class Database {
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
            throw new CustomError("Connection to DB not successful", false, 5001, err);
        }
        log.info("Connected to DB!");
        mongoose.connection.on("disconnected", () => {
            handleError(new CustomError("Database disconnected", false, 5002));
        });
    }
}