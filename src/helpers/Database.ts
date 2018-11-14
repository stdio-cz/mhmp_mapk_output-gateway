import * as mongoose from "mongoose";
import CustomError from "./errors/CustomError";
import handleError from "./errors/ErrorHandler";
const log = require("debug")("data-platform:output-gateway");

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
            handleError(err);
        }
        log("Connected to DB!");
        mongoose.connection.on("disconnected", () => {
            handleError(new CustomError("Database disconnected", false, 5001));
        });
    }
}