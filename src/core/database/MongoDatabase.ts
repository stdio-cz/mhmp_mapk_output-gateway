import { CustomError, ErrorHandler } from "@golemio/errors";
import * as mongoose from "mongoose";
import config from "../../config/config";
import { log } from "../Logger";

/**
 * Class for connection to MongoDB database. Using mongoose https://www.npmjs.com/package/mongoose
 */
export class MongoDatabase {
    private connectionString: string | undefined;
    private connectTimeoutMS: number;

    /** Set up connection string */
    constructor() {
        this.connectionString = config.mongo_connection;
        this.connectTimeoutMS = config.mongo_timeout;
    }

    /** Connects to db */
    public connect = async () => {
        try {
            if (!this.connectionString || this.connectionString === "YOUR CONNECTION STRING GOES HERE") {
                throw new Error("Undefined connection string.");
            }
            await mongoose.connect(this.connectionString, {
                connectTimeoutMS: this.connectTimeoutMS,
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        } catch (err) {
            log.error("Could not connect to " + this.connectionString);
            throw new CustomError("Error while connecting to Mongo DB", false, "MongoDatabase", 5001, err);
        }
        log.info("Connected to Mongo DB!");
        mongoose.connection.on("disconnected", () => {
            ErrorHandler.handle(new CustomError("Database disconnected", false, "MongoDatabase", 5002));
        });
    }
}

const mongooseConnection = new MongoDatabase().connect();

export { mongooseConnection };
