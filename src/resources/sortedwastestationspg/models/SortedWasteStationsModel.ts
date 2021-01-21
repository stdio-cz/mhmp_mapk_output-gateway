import { CustomError } from "@golemio/errors";
import config from "../../../config/config";
import { sequelizeConnection } from "../../../core/database";
import { GeoCoordinatesType, IGeoJSONFeature, IGeoJSONFeatureCollection } from "../../../core/Geo";
import { log } from "../../../core/Logger";

import * as moment from "moment";

export interface ILastMeasurement {
    measured_at_utc: number | string | null;
    percent_calculated: number | null;
    prediction_utc: number | string | null;
}

export interface ILastPick {
    pick_at_utc: number | string | null;
}

export interface IContainer {
    cleaning_frequency: {
        duration: string | null,
        frequency: number | null,
        id: number,
      };
    pick_dates: string[];
    company: string;
    container_type: string;
    description: string;
    trash_type: {
        description: string,
        id: number,
      };
    sensor_container_id: number;
    sensor_code: string;
    sensor_supplier: string;
    last_measurement: ILastMeasurement;
    last_pick: ILastPick;
}

export interface ISortedWasteStationProperties {
    accessibility: {
        description: string,
        id: number,
      };
    district: string;
    id: string;
    name: string;
    station_number: string;
    updated_at: number;
    containers: IContainer[];
    is_monitored: boolean;
}

export interface ISortedWasteStationFeature extends IGeoJSONFeature {
    properties: ISortedWasteStationProperties;
}

export interface ISortedWasteStationFeatures extends IGeoJSONFeatureCollection {
    features: ISortedWasteStationFeature[];
}

export class SortedWasteStationsModelPg {

    public constructor() {
        // nothing
    }

    public async GetAll(options?: {
        /** Filter by accessibility id. Example: 1. */
        accessibility?: number,
        /** Filters the data to include only these with one of the specified "district" value */
        districts?: string[],
        /** Latitude to sort results by (by proximity) */
        lat?: number,
        /** Longitute to sort results by */
        lng?: number,
        /** Maximum range from specified latLng. Only data within this range will be returned. */
        range?: number,
        /** Limit (can be used for pagination). Evaluated last, after all filters applied. */
        limit?: number,
        /** Offset (can be used for pagination). Evaluated last, after all filters applied. */
        offset?: number,
        /** Filter only stations with at least one "smart" container with sensor for
         * measurements and pickups Example: true.
         */
        onlyMonitored?: string,
        id?: string;
    }): Promise<ISortedWasteStationFeatures> {

        try {
            let where = " where 1 = 1 ";
            let distance = "";

            // if (options?.districts) {
            //     where += ` and distance <= ${options?.range} `;
            // }

            if (options?.onlyMonitored) {
                where +=  ` and measurements.measured_at_utc IS NOT NULL `;
            }

            if (options?.lat && options?.lng) {
                distance = ` , ST_DistanceSphere(ST_MakePoint(cs.longitude, cs.latitude), ST_GeomFromText('POINT(${options?.lng} ${options.lat})')) as distance `;
            }

            if (options?.range && options?.lat && options?.lng) {
                where += ` and ST_DistanceSphere(ST_MakePoint(cs.longitude, cs.latitude), ST_GeomFromText('POINT(${options?.lng} ${options.lat})')) <= ${options?.range} `;
            }

            if (options?.districts) {
                where += ` and cs.district in ('${options.districts.join("','")}')`;
            }

            if (options?.id) {
                where +=  ` and cs.id='${options.id}'`;
            }

            const replacements = {
                limit: options?.limit ? options.limit : config.pagination_max_limit,
                offset: options?.offset ? options.offset : 0,
                where,
            };

            const data = await sequelizeConnection.query(

            /* tslint:disable */
                `
                select
                    cs.code,
                    cs.accessibility,
                    cs.latitude,
                    cs.longitude,
                    cs.district,
                    cs.address,
                    cs.updated_at,
                    cs.created_at,
                    cs.id,
                    measurements.measured_at_utc
                    ${distance}
                from containers_stations as cs
                left join (
                    select
                        cm.measured_at_utc as measured_at_utc,
                        cm.station_code as station_code
                    from
                        (select
                            station_code,
                            max(measured_at_utc) as recent_measurement
                        from containers_measurement
                        group by station_code
                        ) as cmm
                    inner join containers_measurement as cm
                    on
                    cmm.recent_measurement = cm.measured_at_utc and cmm.station_code = cm.station_code
                ) as measurements
                on measurements.station_code = cs.code
                ${where}
                order by ${distance ? "distance, " : ""} code
                LIMIT :limit
                OFFSET :offset
                `
            /* tslint:enable */
            , {
                replacements,
            });

            return  this.getStationsData((data || [])[0] || {
                features: [],
                type: "FeatureCollection",
            });
        } catch (err) {
            throw new CustomError("Database error", true, "SortedWasteStationsModelPg", 500, err);
        }
    }

    public async GetOne(id: string): Promise<object> {
        return await this.GetAll({ id });
    }

    private getTrashTypeById = (id: number): string  => {
        switch (id) {
            case 1:
                return "Barevné sklo";
            case 2:
                return "Elektrozařízení";
            case 3:
                return "Kovy";
            case 4:
                return "Nápojové kartóny";
            case 5:
                return "Papír";
            case 6:
                return "Plast";
            case 7:
                return "Čiré sklo";
            case 8:
                return "Textil";
            default:
                return "neznámý";
        }
    }

    private async getStationsData(stations: any): Promise<ISortedWasteStationFeatures> {
        const data: ISortedWasteStationFeatures = {
            features: [] as ISortedWasteStationFeature[],
            type: "FeatureCollection",
        };

        if (!stations || !stations.length) {
            return data;
        }

        const stationsByCode: any = {};
        const stationCodes: any[] = [];

        stations.forEach((station: any) => {
            stationsByCode[station.code] = station;
            stationCodes.push(station.code);
        });

        const sqlData = await sequelizeConnection.query(
            /* tslint:disable */
            `
            select
                cc.cleaning_frequency_interval,
                cc.cleaning_frequency_frequency,
                cc.container_type,
                cc.trash_type,
                cc.code,
                cc.source,
                cc.station_code,
                cc.id,
                cc.knsko_id,
                measurements.measured_at_utc,
                measurements.prediction_utc,
                measurements.percent_calculated,
                measurements.recent_pick
                from containers_containers as cc
                left join (

                    select
                            cm.station_code as station_code,
                            cm.container_code as container_code,
                            cm.prediction_utc as prediction_utc,
                            cm.measured_at_utc as measured_at_utc,
                            cm.percent_calculated as percent_calculated,
                            cpm.recent_pick as recent_pick
                        from
                            (select
                                container_code,
                                max(measured_at_utc) as recent_measurement
                            from containers_measurement
                            group by container_code
                            ) as cmm
                        inner join containers_measurement as cm
                        on
                        cmm.recent_measurement = cm.measured_at_utc and cmm.container_code = cm.container_code
                        left join
                            (select
                                container_code,
                                max(pick_at_utc) as recent_pick
                            from containers_picks
                            group by container_code
                            ) as cpm
                        on cpm.container_code = cm.container_code
                )  as measurements
                on measurements.container_code = cc.code
                where cc.station_code in ('${stationCodes.join("','")}')
                `
                 /* tslint:enable */
            );

        for (const container of (sqlData[0] || []))  {
            if (stationsByCode[container.station_code]) {
                if (!stationsByCode[container.station_code].containers) {
                    stationsByCode[container.station_code].containers = [];
                }

                const picksDates = await sequelizeConnection.query(`select pick_date from containers_picks_dates
                where pick_date >= '${moment().format("YYYY-MM-DD 12:00:00")}'
                and container_id = '${container.id}' order by pick_date limit 30`);

                stationsByCode[container.station_code].containers.push({
                    cleaning_frequency: {
                        duration: `P${container.cleaning_frequency_interval}W`,
                        frequency: +container.cleaning_frequency_frequency || null,
                        // tslint:disable-next-line: max-line-length
                        id: ((+container.cleaning_frequency_interval || 0) * 10) + (+container.cleaning_frequency_frequency || 0),
                    },
                    container_type: container.container_type,
                    pick_dates: (picksDates[0] || []).map((pick: any) => moment(pick.pick_date).format("YYYY-MM-DD")),
                    trash_type: {
                        description: this.getTrashTypeById(+container.trash_type),
                        id: +container.trash_type || null,
                    },
                    // tslint:disable-next-line: object-literal-sort-keys
                    last_measurement : {
                        measured_at_utc: container.measured_at_utc || null,
                        percent_calculated: container.percent_calculated || null,
                        prediction_utc: container.prediction_at_utc || null,
                    },
                    last_pick: container.recent_pick || null,
                    sensor_code: container.measured_at_utc ? container.code : null,
                    sensor_container_id: container.measured_at_utc ? container.id : null,
                    sensor_supplier: container.measured_at_utc ? container.source : null,
                    knsko_id: container.knsko_id ? container.knsko_id : null,
                });
            } else {
                log.warn(`station not found for container in getStationsData: ${JSON.stringify(container)}`);
            }
        }

        for (const station of Object.keys(stationsByCode)) {
            data.features.push({
                geometry: {
                    coordinates: [
                        +stationsByCode[station].longitude || null,
                        +stationsByCode[station].latitude || null,
                   ],
                   type: GeoCoordinatesType.Point,
                },
                properties: {
                   accessibility: {
                      description: "volně",
                      id: 1,
                   },
                   containers: stationsByCode[station].containers,
                   district: stationsByCode[station].district,
                   id: stationsByCode[station].id,
                   is_monitored: !!stationsByCode[station].measured_at_utc,
                   name: stationsByCode[station].address || "",
                   station_number: station,
                   updated_at: stationsByCode[station].created_at ||
                        stationsByCode[station].updated_at,
                },
                type: "Feature",
             });
          }

        return data;
    }
}
