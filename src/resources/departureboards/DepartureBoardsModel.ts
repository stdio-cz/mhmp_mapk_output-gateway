import { CustomError } from "@golemio/errors";
import config from "../../config/config";
import { sequelizeConnection } from "../../core/database";
import { log } from "../../core/Logger";
import { models } from "../../resources/gtfs/models/";

/**
 * Departure boards model.
 */
export class DepartureBoardsModel {

    public constructor() {
        // nothing
    }

    /** Retrieves all gtfs stop times for specific stop, optionaly enhanced with realtime delays
     * @param {string} id Id of the stop
     * @returns Object of the retrieved record or null
     */
    public GetOne = async ( options: {
        limit?: number,
        stopId: string,
    }): Promise<any> => {
        const foundStop = await models.GTFSStopModel.GetOne(options.stopId);
        if (!foundStop) {
            throw new CustomError("Stop not found", true, "DepartureBoardsRouter", 404, null);
        }
        try {
            return sequelizeConnection.query(`
                SELECT * FROM (SELECT
                    (CASE WHEN "t6"."delay" >= 0 THEN ROUND("t6"."delay"/60) ELSE 0 END)::INT AS "delay_minutes",
                    (CASE WHEN "t6"."delay" IS NULL THEN FALSE ELSE TRUE END) AS "is_delay_available",
                    "t1"."arrival_time", "t1"."departure_time",
                    (("t7"."date" + "t1"."arrival_time"::INTERVAL) AT TIME zone 'Europe/Prague' AT TIME zone 'Etc/UTC')::TIMESTAMPTZ AS "arrival_datetime",
                    (("t7"."date" + "t1"."departure_time"::INTERVAL) AT TIME zone 'Europe/Prague' AT TIME zone 'Etc/UTC')::TIMESTAMPTZ AS "departure_datetime",
                    ((("t7"."date" + "t1"."arrival_time"::INTERVAL + MAKE_INTERVAL(0,0,0,0,0,(CASE WHEN "t6"."delay" >= 0 THEN ROUND("t6"."delay"/60) ELSE 0 END)::INT))) AT TIME zone 'Europe/Prague' AT TIME zone 'Etc/UTC')::TIMESTAMPTZ AS "arrival_datetime_real",
                    "t4"."route_short_name",
                    "t2"."trip_id",
                    "t3"."service_id"
                FROM "ropidgtfs_stop_times" AS "t1"
                LEFT JOIN "ropidgtfs_trips" AS "t2" ON "t1"."trip_id" = "t2"."trip_id"
                LEFT JOIN "ropidgtfs_calendar" AS "t3" ON "t2"."service_id" = "t3"."service_id"
                LEFT JOIN "ropidgtfs_routes" AS "t4" ON "t2"."route_id" = "t4"."route_id"
                INNER JOIN "v_ropidgtfs_services_first14days" AS "t7" ON "t2"."service_id" = "t7"."service_id"
                LEFT JOIN
                    (SELECT *, TO_TIMESTAMP("start_timestamp"/1000)::DATE AS "start_date" FROM "vehiclepositions_trips" WHERE TO_TIMESTAMP("start_timestamp"/1000)::DATE  = (NOW() AT TIME zone 'utc')::DATE) AS "t5"
                    ON "t1"."trip_id" = "t5"."gtfs_trip_id" AND "t7"."date" = "t5"."start_date"
                LEFT JOIN "v_vehiclepositions_last_position" AS "t6" ON "t5"."id" = "t6"."trips_id"
                WHERE
                    "t1"."stop_id" = :stopId
                ORDER BY "arrival_datetime_real"
                ) AS "t"
                WHERE "t"."arrival_datetime_real" BETWEEN ((NOW()- INTERVAL '1' year) AT TIME zone 'Etc/UTC') AND ((NOW() + INTERVAL '12' hour) AT TIME zone 'Etc/UTC')
                LIMIT :limit
            `, {
                replacements: {
                    limit: options.limit ? options.limit : config.pagination_max_limit,
                    stopId: options.stopId,
                },
            }).then(([results, metadata]) => {
                return results;
            });
        } catch (err) {
            throw new CustomError("Database error", true, "DepartureBoardsModel", 500, err);
        }
    }

}
