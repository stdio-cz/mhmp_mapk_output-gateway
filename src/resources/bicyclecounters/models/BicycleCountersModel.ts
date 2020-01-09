import { CustomError } from "@golemio/errors";
import { BicycleCounters } from "@golemio/schema-definitions";
import * as moment from "moment";
import { Model, model, Schema } from "mongoose";
import { buildGeojsonFeatureCollection, GeoCoordinatesType, IGeoJSONFeatureCollection } from "../../../core/Geo";
import { log } from "../../../core/Logger";
import { GeoJsonModel } from "../../../core/models";

export class BicycleCountersModel extends GeoJsonModel {

    public static CAMEA_TIME_STEP = 5;
    public static ECOCOUNTER_TIME_STEP = 15;

    public measurementsModel: Model<any>;
    protected measurementsSchema: Schema;

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(BicycleCounters.name, BicycleCounters.outputMongooseSchemaObject, BicycleCounters.mongoCollectionName);

        this.schema.index({ "properties.name": "text" });
        this.projection = { __v: 0, _id: 0 };

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

        // Define the relation (`measurements.name` collection to properties.measurements)
        this.schema.virtual("properties.measurements", {
            foreignField: "counter_id",
            justOne: false,
            localField: "properties.id",
            // Query options, see http://bit.ly/mongoose-query-options
            options: { sort: { measured_to: 1 } },
            ref: BicycleCounters.measurements.name,
        });
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
        limit?: number,
        offset?: number,
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
            if (timePeriod === "hour") {
                from = moment.utc(now).subtract(1, "hour");
            } else if (timePeriod === "12hours") {
                from = moment.utc(now).subtract(12, "hour");
            } else /* today */ {
                from = moment.utc(now).startOf("day");
            }

            // Populate the relation table, add measurements as properties.measurements for the counter
            q.populate({
                // * 1000 because mongo saves date as milliseconds, .unix() is in seconds
                match: { measured_from: { $gte: from.unix() * 1000 } },
                path: "properties.measurements",
            });

            if (options.limit) {
                q.limit(options.limit);
            }
            if (options.offset) {
                q.skip(options.offset);
            }

            q.select(this.projection);

            log.silly("Executing query with selection: ");
            log.silly(this.selection);

            const data = await q.exec();

            // Create GeoJSON FeatureCollection output
            let geoJsonData = buildGeojsonFeatureCollection(data);

            geoJsonData = this.PopulateDirectionsWithMeasurementsValues(geoJsonData, from, timePeriod);
            // Map updated_at to ISOString
            geoJsonData.features = geoJsonData.features.map(this.MapUpdatedAtToISOString);
            return geoJsonData;
        } catch (err) {
            throw new CustomError("Database error", true, "BicycleCountersModel", 500, err);
        }
    }

    private PopulateDirectionsWithMeasurementsValues(   data: IGeoJSONFeatureCollection,
                                                        from: moment.Moment,
                                                        timePeriod: string,
    ): IGeoJSONFeatureCollection {
        data.features.forEach((bicycleCounter: any) => {
            const properties: any = bicycleCounter.properties;

            // Add "value" to bicycle counter's directions
            const bicycleCounterDirections = properties.directions.map((d: any) => ({
                ...d,
                value: null,
            }));

            const isCamea = properties.id.substring(0, 5).toLowerCase() === "camea";
            // Set step according to data source (Camea = 5, ecoCounter = 15 minutes)
            const step = isCamea ? BicycleCountersModel.CAMEA_TIME_STEP : BicycleCountersModel.ECOCOUNTER_TIME_STEP;

            let lastMeasuredAt = null;
            let lastTemperature = null;
            let incompleteData = true;

            // If this counter has some measurements from the measurements collection
            if (bicycleCounter.properties.measurements && bicycleCounter.properties.measurements.length > 0) {
                // Set flag as false
                incompleteData = false;

                let currentStepTimestamp = this.RoundToStepSize(from, step);

                const stepInMilliSeconds = step * 60 * 1000; // milliseconds;

                bicycleCounter.properties.measurements.forEach((singleMeasurement: any) => {
                    // If measured data are not timestamped properly by each next step, something is missing
                    if (singleMeasurement.measured_from !== currentStepTimestamp) {
                        incompleteData = true;
                    }
                    this.AddMeasurementsValuesToCounterDirections(bicycleCounterDirections, singleMeasurement);
                    currentStepTimestamp += stepInMilliSeconds;
                    lastMeasuredAt = singleMeasurement.measured_from;
                    if (singleMeasurement.temperature) {
                        lastTemperature = singleMeasurement.temperature;
                    }
                });
            }

            const detections = {
                directions: bicycleCounterDirections,
                incomplete_data: incompleteData,
                measured_at: lastMeasuredAt != null ? moment(lastMeasuredAt).toISOString() : null,
                time_period: timePeriod,
            };

            bicycleCounter.properties.detections = detections;
            bicycleCounter.properties.temperature = lastTemperature;

            delete bicycleCounter.properties.measurements;
            delete bicycleCounter.properties.directions;
        });
        return data;
    }
    /**
     * Adds all measurements' values to matching directions of this bicycle counter
     * @param bicycleCounterDirections This counter's directions to add values to
     * @param singleMeasurement Measurement record to to add values from
     */
    private AddMeasurementsValuesToCounterDirections(bicycleCounterDirections: any, singleMeasurement: any) {
        if (singleMeasurement.directions) {
            singleMeasurement.directions.forEach((measurementDirection: any) => {
                // Find direction of the counter with the same ID as this measurement's direction
                // and add value
                const directionFound = bicycleCounterDirections.find(
                    (singleBicycleCounterDirection: any) => {
                        return singleBicycleCounterDirection.id === measurementDirection.id;
                    },
                );
                if (directionFound) {
                    directionFound.value = (directionFound.value || 0) + measurementDirection.value;
                }
            });
        }
    }
    /**
     * Round to the step-size (subtract remaining minutes, set seconds and millis to 0)
     * If "today", it is already rounded
     */
    private RoundToStepSize = (timestamp: moment.Moment, step: number) => {
        const remainder = (timestamp.minute() % step);
        const rounded = moment.utc(timestamp).subtract(remainder, "minutes").seconds(0).milliseconds(0);
        return (rounded.unix() * 1000);
    }
}
