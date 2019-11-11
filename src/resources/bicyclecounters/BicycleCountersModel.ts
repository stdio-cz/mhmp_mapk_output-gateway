import { CustomError } from "@golemio/errors";
import { BicycleCounters } from "@golemio/schema-definitions";
import * as moment from "moment";
import { Model, model, Schema } from "mongoose";
import { buildGeojsonFeatureCollection, GeoCoordinatesType, IGeoJSONFeatureCollection } from "../../core/Geo";
import { log } from "../../core/Logger";
import { GeoJsonModel } from "../../core/models";

export class BicycleCountersModel extends GeoJsonModel {

    public measurementsModel: Model<any>;
    protected measurementsSchema: Schema;

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(BicycleCounters.name, BicycleCounters.outputMongooseSchemaObject, BicycleCounters.mongoCollectionName);

        this.schema.index({ "properties.name": "text" });
        // this.schema.add({
        //     "properties.measurements": [{ type: Schema.Types.ObjectId, ref: BicycleCounters.measurements.name }],
        // });
        this.projection = { __v: 0 };

        this.measurementsSchema = new Schema(BicycleCounters.measurements.outputMongooseSchemaObject);

        // assign existing mongo model or create new one
        try {
            this.measurementsModel = model(BicycleCounters.measurements.name); // existing model
        } catch (error) {
            // uses database collection named as plural of model's name (eg. "parkings" for "Parking" model)
            // or collection name specified in the third parameter
            this.measurementsModel = model(BicycleCounters.measurements.name,
                this.measurementsSchema,
                BicycleCounters.measurements.mongoCollectionName);
        }

        this.schema.virtual("properties.measurements", {
            foreignField: "counter_id",
            justOne: false,
            localField: "_id",
            // Query options, see http://bit.ly/mongoose-query-options
            options: { sort: { measured_to: 1 } },
            ref: BicycleCounters.measurements.name,
        });
    }

    public PrimaryIdentifierSelection = (inId: any) => {
        return { _id: inId };
    }

    /** Retrieves all the records from database
     * @param options Object with options settings, with following properties.
     * @param options.ids Filters the data to include only specified IDs
     * @param options.lat Latitude to sort results by (by proximity)
     * @param options.lng Longitute to sort results by
     * @param options.range Maximum range from specified latLng. Only data within this range will be returned.
     * @param options.timePeriod Aggregates result only for specific time interval: today, hour, 12hours
     * @returns GeoJSON FeatureCollection with all retrieved objects in "features"
     */
    public async GetAll(options: {
        lat?: number,
        lng?: number,
        range?: number,
        timePeriod?: "today" | "hour" | "12hours",
        ids?: any[],
    } = {}): Promise<IGeoJSONFeatureCollection> {
        try {
            const timePeriod = options.timePeriod || "today";

            const q = this.model.find({}).lean();

            // Specify a query filter conditions to search by geometry location
            if (options.lat) {
                const selection: any = {
                    geometry: {
                        $near: {
                            $geometry: {
                                coordinates: [options.lng, options.lat],
                                type: GeoCoordinatesType.Point,
                            },
                        },
                    },
                };
                // Specify max range filter condition
                if (options.range !== undefined) {
                    selection.geometry.$near.$maxDistance = options.range;
                }
                this.AddSelection(selection);
            }

            // Specify a query filter conditions to search by IDs
            if (options.ids) {
                this.AddSelection(this.PrimaryIdentifierSelection({ $in: options.ids }));
            }

            q.where(this.selection);

            const now: moment.Moment = moment.utc();
            let from: moment.Moment;
            const to: number = moment.utc(now).unix();
            if (timePeriod === "hour") {
                from = moment.utc(now).subtract(1, "hour");
            } else if (timePeriod === "12hours") {
                from = moment.utc(now).subtract(12, "hour");
            } else /* today */ {
                from = moment.utc(now).startOf("day");
            }

            const fromAsNumber: number = from.unix();

            q.populate({
                match: { measured_to: { $gte: fromAsNumber/*, $lt: to*/ } },
                path: "properties.measurements",
            });

            q.select(this.projection);

            log.silly("Executing query with selection: ");
            log.silly(this.selection);

            const data = await q.exec();

            // Create GeoJSON FeatureCollection output
            const geoJsonData = buildGeojsonFeatureCollection(data);

            geoJsonData.features.forEach((x: any) => {
                const properties: any = x.properties;
                properties.id = x._id;
                delete x._id;

                const directions = properties.directions.map((d: any) => ({
                    ...d,
                    value: null,
                }));

                const isCamea = properties.extern_source === "camea";
                const step = isCamea ? 5 : 15;

                let lastMeasuredAt = null;
                let lastTemperature = null;
                let incompleteData = true;

                if (x.properties.measurements && x.properties.measurements.length > 0) {
                    incompleteData = false;

                    let timestamp = fromAsNumber;
                    if (timePeriod === "hour" || timePeriod === "12hours") {
                        const remainder = (from.minute() % step);

                        const rounded = moment.utc(from).subtract(remainder, "minutes").seconds(0).milliseconds(0);
                        timestamp = rounded.unix();
                    }

                    const stepInSeconds = step * 60; // seconds;

                    x.properties.measurements.forEach((m: any) => {
                        if (timestamp !== m.measured_from) {
                            incompleteData = true;
                        }
                        timestamp += stepInSeconds;

                        if (m.directions) {
                            m.directions.forEach((md: any) => {
                                const direction = directions.find((d: any) => d.id === md.id);
                                if (direction) {
                                    direction.value = (direction.value || 0) + md.value;
                                }
                            });
                        }

                        lastMeasuredAt = m.measured_from;
                        if (m.temperature) {
                            lastTemperature = m.temperature;
                        }
                    });
                }

                const detections = {
                    directions,
                    incomplete_data: incompleteData,
                    measured_at: lastMeasuredAt,
                    time_period: timePeriod,
                };

                x.properties.detections = detections;
                x.properties.temperature = lastTemperature; // m.temperature;

                delete x.properties.measurements;
                delete x.properties.directions;
            });
            return geoJsonData;
        } catch (err) {
            throw new CustomError("Database error", true, "BicycleCountersModel", 500, err);
        }
    }
}
