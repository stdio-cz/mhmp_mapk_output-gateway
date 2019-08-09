import { CustomError } from "golemio-errors";
import { getSubProperty } from "golemio-utils";
import { log } from "./Logger";

export enum GeoCoordinatesType {
    Point = "Point",
    Polygon = "Polygon",
    MultiPolygon = "MultiPolygon",
    LineString = "LineString",
    MultiLineString = "MultiLineString",
}

export interface IGeoCoordinatesPoint {
    coordinates: number[];
    type: GeoCoordinatesType.Point;
}

export interface IGeoCoordinatesPolygon {
    coordinates: number[][];
    type: GeoCoordinatesType.Polygon;
}

export type TGeoCoordinates = IGeoCoordinatesPoint | IGeoCoordinatesPolygon;

/**
 * Interface for http://geojson.org/ Feature format
 */
export interface IGeoJSONFeature {
    /**
     * Geometry property. Coordinates can be one or two-dimensional array of coordinates or single coordinate
     */
    geometry: TGeoCoordinates;
    /**
     *  Object with properties
     */
    properties: object;
    /**
     *  GeoJSON type - always "Feature" in GeoJSONFeature
     */
    type: "Feature";
}

/**
 * Interface for http://geojson.org/ Feature collection format
 */
export interface IGeoJSONFeatureCollection {
    features: IGeoJSONFeature[];
    /**
     *  GeoJSON type - always "FeatureCollection" in GeoJSONFeatureCollection
     */
    type: "FeatureCollection";
}

/**
 * Parses geo coordinates parameters in "latlng" and "range" string format
 * @param {string} latlng Latlng string
 * @param {range} range Range string
 * @returns {object} Object with lat, lng, and range numerical values
 */
export const parseCoordinates = async (
    latlng: string,
    range: string,
): Promise<{
    lat: number | undefined,
    lng: number | undefined,
    range: number | undefined,
}> => {

    let lat: number | undefined;
    let lng: number | undefined;
    let ran: number | undefined;

    if (latlng) {
        const [latStr, lngStr] = latlng.split(",");
        lat = +latStr;
        lng = +lngStr;
        ran = parseInt(range, 10);
        if (isNaN(ran)) {
            ran = undefined;
        }
        if (isNaN(lat) || isNaN(lng)) {
            log.silly("Wrong input parameter lat: `" + lat + "` or lng: `" + lng + "`");
            return Promise.reject(new CustomError("Bad request - wrong input parameters", true, "Geo", 400));
        }
    }
    return { lat, lng, range: ran };
};

/**
 * Builds a GeoJSON feature from object or JSON
 * @param item Item to convert to GeoJSON Feature format
 * @param lonProperty Location of lon property
 * @param latProperty Location of lat property
 * @returns {IGeoJSONFeature} GeoJSON feature - object with geometry, properties, and type = "Feature"
 */
export const buildGeojsonFeature = (item: any, lonProperty: string, latProperty: string): IGeoJSONFeature => {
    const properties = item.toJSON ? item.toJSON() : item;
    const lon = getSubProperty<number>(lonProperty, item);
    const lat = getSubProperty<number>(latProperty, item);
    return ({
        geometry: {
            coordinates: [
                +lon,
                +lat,
            ],
            type: GeoCoordinatesType.Point,
        },
        properties,
        type: "Feature",
    });
};

/**
 * Builds a GeoJSON featureCollection from object or JSON
 * @param items Array of items to convert to GeoJSON Feature collection format.
 * Array of GeoJSONFeatures if latProperty or lonProperty is not specified
 * @param lonProperty Custom location of lon property. If not specified, assumes GeoJSONFeature structure of {items}
 * @param latProperty Custom location of lat property. If not specified, assumes GeoJSONFeature structure of {items}
 * @returns {IGeoJSONFeatureCollection} GeoJSON feature collection - object with features and type = "FeatureCollection"
 */
export const buildGeojsonFeatureCollection =
    (items: any, lonProperty?: string, latProperty?: string): IGeoJSONFeatureCollection => {
        if (!lonProperty || !latProperty) {
            log.silly("Custom lat or lon property path not specified when building GeoJSON FeatureCollection,"
                + " assuming GeoJSONFeature format of data.");
            if (items.length > 0 &&
                (!items[0].geometry ||
                    !items[0].geometry.coordinates ||
                    !items[0].geometry.type ||
                    items[0].type !== "Feature" ||
                    !items[0].properties)) {
                log.warn("The data are not in GeoJSONFeature format and lat lon " +
                    "property locations were not specified. Possible malformed GeoJSON on output");
            }
            return {
                features: items,
                type: "FeatureCollection",
            };
        } else {
            return {
                features: items.map((item: any) => buildGeojsonFeature(item, lonProperty, latProperty)),
                type: "FeatureCollection",
            };
        }
    };
