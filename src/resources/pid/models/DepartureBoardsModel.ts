import { CustomError } from "@golemio/errors";
import * as moment from "moment-timezone";
import config from "../../../config/config";
import { sequelizeConnection } from "../../../core/database";
import { models } from "../../gtfs/models";

/**
 * Departure boards model.
 */
export class DepartureBoardsModel {
    private stopsMaxCount = 100;

    public constructor() {
        // nothing
    }

    /** Retrieves all gtfs stop times for specific stop, optionaly enhanced with realtime delays
     * @param {string} id Id of the stop
     * @returns Object of the retrieved record or null
     */
    public GetAll = async ( options: {
        aswIds?: string[],
        cisIds?: number[],
        gtfsIds?: string[],
        names?: string[],
        limit?: number,
        offset?: number,
        mode?: string,
        orderBySchedule?: boolean,
        minutesBefore: number,
        minutesAfter: number,
        timeFrom?: string,
        showAllRoutesFirst?: boolean,
    }): Promise<any> => {

        const stopsToInclude = await models.GTFSStopModel.GetAll({
            appendAswId: true,
            aswIds: options.aswIds,
            cisIds: options.cisIds,
            gtfsIds: options.gtfsIds,
            limit: this.stopsMaxCount +  1,
            locationType: 0,
            names: options.names,
            returnRaw: true,
        });

        if (stopsToInclude.length === 0) {
            throw new CustomError("No stops found.", true, "DepartureBoardsRouter", 404, null);
        }
        if (stopsToInclude.length > this.stopsMaxCount) {
            throw new CustomError(`Too many stops, try lower number or split requests. The maximum is ${this.stopsMaxCount} stops.`, true, "DepartureBoardsRouter", 413, null);
        }
        try {
            // default value
            const mode = options.mode || "departures";
            let modeCondition = ``;
            switch (mode) {
                case "arrivals":
                    modeCondition = ` AND "t1"."drop_off_type" != '1' AND "t1"."stop_sequence" != "t9"."min_stop_sequence" `;
                    break;
                case "mixed":
                    modeCondition = ` AND "t1"."pickup_type" != '1' `;
                    break;
                default:
                    // departures are default value
                    modeCondition = ` AND "t1"."pickup_type" != '1' AND "t1"."stop_sequence" != "t9"."max_stop_sequence" `;
                    break;
            }

            const minutesOffset = (options.timeFrom && moment(options.timeFrom).isValid()) ?
                moment(options.timeFrom).diff(moment(), "minutes") : 0;

            const orderBySchedule = options.orderBySchedule ? `"arrival_datetime" ASC` : `"arrival_datetime_real" ASC`;
            const showAllRoutesFirst = options.showAllRoutesFirst ? `"route_order" ASC, ` : ``;
            return sequelizeConnection.query(

            /*
                Little departure board description...
                ===

                It first selects "ropidgtfs_stop_times".
                Joins attributes of stops, trips, calendars, routes, and services planned for actual days.
                Joins also all "vehiclepositions_trips" (realtime monitored vehicles) with start of trip from yesterday till today if available.
                    Note: Yesterday trip early after midnight can be still on the track!
                Then it joins also for these vehicles their last positions to gather last delay.
                This select is filtered by wanted stops only and ordered by real or scheduled arrival times.

                All results we rank first by routes and their headsign and after that by arrival time.
                If param showAllRoutesFirst is true we order first by unique route - headsign and then by arrival time (thru the rank)

                Real departure time is not that easy too :-)
                We add delay to real arrival time and we also want to add it to departure time.
                But the trip can dwell some time on the stop, so we need subtract the delay with the dwell time.
                If the trip is with negative delay (too fast), departure time is not less than 60s ahead, rules for the drivers speak that way!

                Limit and offset is aplied too.

                Hope this helps :-)
            */
            /* tslint:disable */
                `
                SELECT
                    (CASE WHEN (
                        RANK() OVER (PARTITION BY "t"."route_short_name", "t"."trip_headsign"
                        ORDER BY ` + orderBySchedule + `)
                    ) = 1 THEN 1 ELSE 2 END) AS "route_order", "t".*
                FROM (
                    SELECT
                        *,
                        (
                            "t"."departure_datetime" + GREATEST(
                                MAKE_INTERVAL(0,0,0,0,0,0,0),
                                CASE WHEN ("t"."departure_datetime" - "t"."arrival_datetime")::INTERVAL > '00:00'::INTERVAL
                                    THEN GREATEST(
                                        '00:00'::INTERVAL,
                                        MAKE_INTERVAL(0,0,0,0,0,0,  (CASE WHEN "t"."delay_seconds" IS NULL THEN 0 ELSE "t"."delay_seconds" END))
                                             - ("t"."departure_datetime" - "t"."arrival_datetime")::INTERVAL
                                    )
                                    ELSE MAKE_INTERVAL(0,0,0,0,0,0,(CASE WHEN "t"."delay_seconds" IS NULL THEN 0 ELSE "t"."delay_seconds" END))
                                END
                            )
                        )  AS "departure_datetime_real"
                    FROM (
                        SELECT
                            "t6"."delay" AS "delay_seconds",
                            (CASE WHEN "t6"."delay" IS NOT NULL THEN TRUNC("t6"."delay"::DECIMAL/60, 0) ELSE NULL END)::INT AS "delay_minutes",
                            (CASE WHEN "t6"."delay" IS NULL THEN FALSE ELSE TRUE END) AS "is_delay_available",
                            "t1"."arrival_time", "t1"."departure_time",
                            (("t7"."date" + "t1"."arrival_time"::INTERVAL) AT TIME zone 'Europe/Prague' AT TIME zone 'Etc/UTC')::TIMESTAMPTZ AS "arrival_datetime",
                            (("t7"."date" + "t1"."departure_time"::INTERVAL) AT TIME zone 'Europe/Prague' AT TIME zone 'Etc/UTC')::TIMESTAMPTZ AS "departure_datetime",
                            (
                                (
                                    ("t7"."date" + "t1"."arrival_time"::INTERVAL + MAKE_INTERVAL(
                                        0,0,0,0,0,0,(CASE WHEN "t6"."delay" IS NOT NULL THEN "t6"."delay" ELSE 0 END)
                                    ))
                                ) AT TIME zone 'Europe/Prague' AT TIME zone 'Etc/UTC'
                            )::TIMESTAMPTZ AS "arrival_datetime_real",
                            "t0"."stop_id",
                            "t0"."stop_name",
                            "t0"."platform_code",
                            "t0"."wheelchair_boarding",
                            "t5"."gtfs_route_short_name" AS "route_short_name",
                            "t5"."gtfs_route_type" AS "route_type",
                            "t5"."vehicle_type_id" AS "mpv_type",
                            "t2"."trip_id",
                            "t2"."trip_headsign",
                            "t2"."trip_short_name",
                            "t2"."wheelchair_accessible",
                            "t6"."is_canceled",
                            "t6"."last_stop_id",
                            "t8"."stop_name" AS "last_stop_name",
                            "t3"."service_id",
                            "t1"."stop_sequence",
                            "t9"."min_stop_sequence",
                            "t9"."max_stop_sequence"
                        FROM "ropidgtfs_stop_times" AS "t1"
                        LEFT JOIN "ropidgtfs_stops" AS "t0" ON "t1"."stop_id" = "t0"."stop_id"
                        LEFT JOIN "v_ropidgtfs_trips_minmaxsequences" AS "t9" ON "t1"."trip_id" = "t9"."trip_id"
                        LEFT JOIN "ropidgtfs_trips" AS "t2" ON "t1"."trip_id" = "t2"."trip_id"
                        LEFT JOIN "ropidgtfs_calendar" AS "t3" ON "t2"."service_id" = "t3"."service_id"
                        INNER JOIN "v_ropidgtfs_services_first14days" AS "t7" ON "t2"."service_id" = "t7"."service_id"
                        LEFT JOIN (
                                SELECT *, TO_TIMESTAMP("start_timestamp"/1000)::DATE AS "start_date" FROM "vehiclepositions_trips"
                                WHERE TO_TIMESTAMP("start_timestamp"/1000)::DATE BETWEEN (NOW() AT TIME zone 'utc' - INTERVAL '1 day')::DATE AND (NOW() AT TIME zone 'utc')::DATE
                            ) AS "t5"
                            ON "t1"."trip_id" = "t5"."gtfs_trip_id" AND "t7"."date" = "t5"."start_date"
                        LEFT JOIN (SELECT * FROM "v_vehiclepositions_last_position" WHERE "tracking" = 2) AS "t6" ON "t5"."id" = "t6"."trips_id"
                        LEFT JOIN "ropidgtfs_stops" AS "t8" ON "t6"."last_stop_id" = "t8"."stop_id"
                        WHERE "t1"."stop_id" IN(:stopId) ` + modeCondition + `
                        ORDER BY ` + orderBySchedule + `
                    ) AS "t"
                    WHERE "t"."arrival_datetime_real" BETWEEN 
                      ((NOW() + INTERVAL :minutesOffset - INTERVAL :minutesBefore) AT TIME zone 'Etc/UTC') 
                      AND ((NOW() + INTERVAL :minutesOffset + INTERVAL :minutesAfter) AT TIME zone 'Etc/UTC')
                ) AS "t"
                ORDER BY ` + showAllRoutesFirst + orderBySchedule + `
                LIMIT :limit
                OFFSET :offset
                `
            /* tslint:enable */
            , {
                replacements: {
                    limit: options.limit ? options.limit : config.pagination_max_limit,
                    minutesAfter: options.minutesAfter + " min",
                    minutesBefore: options.minutesBefore + " min",
                    minutesOffset: minutesOffset + " min",
                    offset: options.offset ? options.offset : 0,
                    stopId: stopsToInclude.map((stop: any) => stop.stop_id),
                },
            }).then(([results, metadata]) => {
                return {
                    departures: results,
                    infotexts: [],
                    stops: stopsToInclude,
                };
            });
        } catch (err) {
            throw new CustomError("Database error", true, "DepartureBoardsModel", 500, err);
        }
    }

}
