import {VehiclePositions} from "data-platform-schema-definitions";
import CustomError from "../helpers/errors/CustomError";
import log from "../helpers/Logger";
import sequelizeConnection from "../helpers/PostgreDatabase";
import {SequelizeModel} from "./SequelizeModel";

/**
 * TODO
 */
export class VehiclePositionsModel extends SequelizeModel {

    public constructor() {
        super(VehiclePositions.name, VehiclePositions.trips.pgTableName,
            VehiclePositions.trips.outputSequelizeAttributes);
    }

    public GetAll = async (): Promise<any> => {
        try {
            const data = await sequelizeConnection.query(
                "SELECT DISTINCT ON (line, route_id_cis) line, route_id_cis, created, timestamp, last_stop_id_cis, " +
                "delay_stop_departure, tracking, start_date, lat, lng, is_low_floor, is_canceled " +
                "FROM " + VehiclePositions.trips.pgTableName +
                " WHERE tracking = 2 AND created > (NOW() - INTERVAL '5 min')");
            const retData: any = [];
            for (const element of data[0]) {
                retData.push({
                    geometry: {
                        coordinates: [
                            +element.lng,
                            +element.lat,
                        ],
                        type: "Point",
                    },
                    properties: {
                        created: element.created,
                        delay_stop_departure: element.delay_stop_departure,
                        is_canceled: element.is_canceled,
                        is_low_floor: element.is_low_floor,
                        last_stop_id_cis: element.last_stop_id_cis,
                        line: element.line,
                        route_id_cis: element.route_id_cis,
                        start_date: element.start_date,
                        timestamp: element.timestamp,
                        tracking: element.tracking,
                    },
                    type: "Feature",
                });
            }
            return {
                features: retData,
                type: "FeatureCollection",
            };
        } catch (err) {
            throw new CustomError("Database error", true, 500, err);
        }
    }

    public GetOne = async (id: number): Promise<object> => {
        log.debug("Getting one");
        return {position: "TBD"};
    }
}
