import { SortedWasteStations } from "@golemio/schema-definitions";
import { IGeoJSONFeature } from "../../../core/Geo";
import { log } from "../../../core/Logger";
import { GeoJsonModel } from "../../../core/models";

export interface IContainer {
    cleaning_frequency: number;
    company: string;
    container_type: string;
    description: string;
    trash_type: string;
    sensor_container_id: number;
    sensor_code: string;
    sensor_supplier: string;
}

export interface ISortedWasteStationProperties {
    accessibility: object;
    district: string;
    id: number;
    name: string;
    station_number: string;
    updated_at: number;
    containers: IContainer[];
}

export interface ISortedWasteStationFeature extends IGeoJSONFeature {
    properties: ISortedWasteStationProperties;
}

export class SortedWasteStationsModel extends GeoJsonModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(SortedWasteStations.name,
            SortedWasteStations.outputMongooseSchemaObject,
            SortedWasteStations.mongoCollectionName);
    }

    // @override
    public async GetAll(options?: {
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
        /** Filters all results with older updated_at timestamp than this parameter
         * (filters not-updated data)
         */
        updatedSince?: number,
        /** Filters the data to include only these with one of the specified "district" value */
        districts?: string[],
        /** Filters the data to include only specified IDs */
        ids?: number[],
        /** Object with additional filter conditions to be added to the selection */
        additionalFilters?: object,
    }): Promise<any> {
        const data = await super.GetAll(options);
        data.features = data.features.map((record: any) => this.EnrichOutputFeatureRecord(record));
        return data;
    }

    // @override
    public async GetOne(inId: number): Promise<object> {
        return await this.EnrichOutputFeatureRecord(await super.GetOne(inId));
    }

    /**
     * Returns true if the item has at least one container that is monitored
     * @param item Sorted waste GeoJSON feature to check its containers
     */
    protected HasMonitoredContainer(item: ISortedWasteStationFeature): boolean {
        for (const singleContainer of item.properties.containers) {
            if (singleContainer.sensor_container_id) {
                return true;
            }
        }
        return false;
    }

    /**
     * Enriches the output feature with some additional data before returning it
     * @param item GeoJSON feature to be enriched with some additional properties
     */
    protected EnrichOutputFeatureRecord(item: any): Promise<any> {
        return this.EnrichWithMonitoredFlag(item);
    }

    /**
     * Enriches the item with flag "is_monitored",
     * which is true if the item has at least one container that is monitored
     * @param item Sorted waste GeoJSON feature to be enriched with flag if it contains a monitored
     * container
     */
    protected EnrichWithMonitoredFlag(item: ISortedWasteStationFeature): any {
        const flag = this.HasMonitoredContainer(item);
        return flag ? {
            geometry: item.geometry,
            properties: {
                ...item.properties,
                is_monitored: true,
            },
            type: item.type,
        } : item;
    }
}
