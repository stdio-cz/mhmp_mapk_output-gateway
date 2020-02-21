import { CustomError } from "@golemio/errors";
import { ParkingZones } from "@golemio/schema-definitions";
import * as hash from "object-hash";
import { IGeoJSONFeature, IGeoJSONFeatureCollection } from "../../core/Geo";
import { log } from "../../core/Logger";
import { GeoJsonModel } from "../../core/models";

export class ParkingZonesModel extends GeoJsonModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(ParkingZones.name, ParkingZones.outputMongooseSchemaObject, ParkingZones.mongoCollectionName);

        this.schema.index({ "properties.name": "text" });
    }

    /** Retrieves all the records from database
     * @param options Object with options settings, with following properties.
     * @param options.lat Latitude to sort results by (by proximity)
     * @param options.lng Longitute to sort results by
     * @param options.range Maximum range from specified latLng. Only data within this range will be returned.
     * @param options.limit Limit
     * @param options.offset Offset
     * @param options.updatedSince Filters out all results with older updated_at than this parameter
     * (filters not-updated data)
     * @param options.additionalFilters Object with additional filter conditions to be added to the selection
     * @returns GeoJSON FeatureCollection with all retrieved objects in "features"
     */
    public async GetAll(options: {
        lat?: number,
        lng?: number,
        range?: number,
        limit?: number,
        offset?: number,
        updatedSince?: string,
        districts?: string[],
        ids?: number[],
        additionalFilters?: object,
    } = {}): Promise<IGeoJSONFeatureCollection> {
        try {
            const result = await super.GetAll(options);
            result.features.forEach((x: IGeoJSONFeature) => {
                const properties: any = x.properties;
                const tariffIds = properties.tariffs.map((y: any) => hash(y));
                delete properties.tariffs;
                properties.tariff_ids = tariffIds;
            });
            return result;
        } catch (err) {
            throw new CustomError("Database error", true, "ParkingZonesModel", 500, err);
        }
    }

    /** Retrieves one record from database
     * @param inId Id of the record to be retrieved
     * @returns Object of the retrieved record or null
     */
    public GetOne = async (inId: any): Promise<object> => {
        const found = await this.model.findOne(this.PrimaryIdentifierSelection(inId), "-_id -__v").lean().exec();
        if (!found || found instanceof Array && found.length === 0) {
            log.debug("Could not find any record by following selection:");
            log.debug(this.PrimaryIdentifierSelection(inId));
            throw new CustomError("Id `" + inId + "` not found", true, "ParkingZonesModel", 404);
        } else {
            return this.mapFeatureRecord(this.MapUpdatedAtToISOString(found));
        }
    }

    /** Retrieves tariffs to one zone
     * @param inId Id of the record which tariffs to be retrieved
     * @returns Object of the retrieved record or null
     */
    public GetTariffsByParkingZoneId = async (inId: any): Promise<object> => {
        const found = await this.model.findOne(this.PrimaryIdentifierSelection(inId),
            { "properties.tariffs": 1, "_id": 0 },
        ).exec();
        if (!found || found instanceof Array && found.length === 0) {
            log.debug("Could not find any record by specified selection.", this.PrimaryIdentifierSelection(inId));
            throw new CustomError("Id `" + inId + "` not found", true, "ParkingZonesModel", 404);
        } else if (!found.properties || found.properties.tariffs === undefined) {
            log.debug("Object doesn't have properties or properties.tariffs");
            throw new CustomError("Id `" + inId + "` not found", true, "ParkingZonesModel", 404);
        } else {
            return found.properties.tariffs.map((x: any) => ({ ...x, tariff_id: hash(x) }));
        }
    }

    /**
     * Gets all distinct tariff objects for parking zones
     */
    public GetAllTariffs = async (): Promise<object[]> => {
        const found = await this.model.find({}, "properties.tariffs").exec();
        const mapped = found.map((x) => x.properties.tariffs);
        const result = [].concat(...mapped);
        const resultWithHashes = result.map((x: any) => ({ ...x, tariff_id: hash(x) }));
        const setOfHashes = new Set();
        const distinctResult = [];
        for (const item of resultWithHashes) {
            if (!setOfHashes.has(item.tariff_id)) {
                setOfHashes.add(item.tariff_id);
                distinctResult.push(item);
            }
        }
        return distinctResult;
    }

    private mapFeatureRecord(item: any) {
        return item.properties.tariffs != null ? {
            geometry: item.geometry,
            properties: {
                ...item.properties,
                tariffs: item.properties.tariffs.map((x: any) => ({ ...x, tariff_id: hash(x) })),
            },
            type: item.type,
        } : item;
    }
}
