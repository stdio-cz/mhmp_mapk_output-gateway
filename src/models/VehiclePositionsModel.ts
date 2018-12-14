import CustomError from "../helpers/errors/CustomError";
import log from "../helpers/Logger";
import * as Sequelize from "sequelize";
const { sequelizeConnection } = require("../helpers/PostgreDatabase");
import { VehiclePositions } from "data-platform-schema-definitions";

/**
 * 
 */
export default class VehiclePositionsModel {
    /** The Sequelize Model */
    protected sequelizeModel: Sequelize.Model<any, any>;
    /** Name of the model */
    protected name: string;

    public constructor() {
        this.name = "VehiclePositions";
        this.sequelizeModel = sequelizeConnection.define("vehicle_positions_trips", VehiclePositions.trips.outputSequelizeAttributes);
    }

    public GetAll = async (): Promise<any> => {
        const data = await sequelizeConnection.query(
"SELECT DISTINCT ON (line, route_id_cis) line, route_id_cis, created, timestamp, last_stop_id_cis, delay_stop_departure, tracking, start_date, lat, lng, is_low_floor, is_canceled " + 
"FROM vehicle_positions_trips WHERE tracking = 2 AND created > (NOW() - INTERVAL '5 min')");
        const retData: any = [];
        for (let element of data[0]){
            retData.push({
                "type": "Feature",
                "properties": {
                    "line": element.line,
                    "route_id_cis": element.route_id_cis,
                    "created": element.created,
                    "timestamp": element.timestamp,
                    "last_stop_id_cis": element.last_stop_id_cis,
                    "delay_stop_departure": element.delay_stop_departure,
                    "tracking": element.tracking,
                    "start_date": element.start_date,
                    "is_low_floor": element.is_low_floor,
                    "is_canceled": element.is_canceled,
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        +element.lng,
                        +element.lat
                    ]
                }
            });
        }
        return {
            features: retData,
            type: "FeatureCollection",
        }
    }

    public GetOne = async (id: number): Promise<object> => {
        log.debug("Getting one");
        return {"position": "TBD"};
    }

}