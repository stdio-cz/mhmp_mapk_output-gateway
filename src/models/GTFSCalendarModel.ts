import {RopidGTFS} from "data-platform-schema-definitions";
import * as Sequelize from "sequelize";
import CustomError from "../helpers/errors/CustomError";
import log from "../helpers/Logger";
import sequelizeConnection from "../helpers/PostgreDatabase";

/**
 * TODO
 */
export class GTFSCalendarModel {
    /** The Sequelize Model */
    protected sequelizeModel: Sequelize.Model<any, any>;
    /** Name of the model */
    protected name: string;

    public constructor() {
        this.name = RopidGTFS.calendar.name;
        this.sequelizeModel = sequelizeConnection.define(RopidGTFS.calendar.pgTableName,
            RopidGTFS.calendar.outputSequelizeAttributes,
        );
    }
}
