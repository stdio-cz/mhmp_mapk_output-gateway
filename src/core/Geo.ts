import {CustomError} from "./errors";
import {log} from "./Logger";

/**
 * Interface for http://geojson.org/ Feature format
 */
export interface IGeoJSONFeature {
    /**
     * Geometry property. Coordinates can be one or two-dimensional array of coordinates or single coordinate
     */
    geometry: { coordinates: any, type: string };
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
     *  GeoJSON type - always "FeatureCollection" in GeoJSONFeature
     */
    type: "FeatureCollection";
}

/**
 * Parses geo coordinates parameters in "latlng" and "range" string format
 * @param {string} latlng Latlng string
 * @param {range} range Range string
 * @returns {object} Object with lat, lng, and range numerical values
 */
export const parseCoordinates = async (latlng: string,
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
            return Promise.reject(new CustomError("Bad request - wrong input parameters", true, 400));
        }
    }
    return {lat, lng, range: ran};
};

/**
 * Builds a GeoJSON feature from object or JSON
 * @param item Item to convert to GeoJSON Feature format
 * @param lonProperty Location of lon property
 * @param latProperty Location of lat property
 * @returns {IGeoJSONFeature} GeoJSON feature - object with geometry, properties, and type = "Feature"
 */
export const buildGeojsonFeature = (item: any, lonProperty: string, latProperty: string): IGeoJSONFeature => {
    const {[lonProperty]: lon, [latProperty]: lat, ...properties} = item.toJSON ? item.toJSON() : item;
    return ({
        geometry: {
            coordinates: [
                +lon,
                +lat,
            ],
            type: "Point",
        },
        properties,
        type: "Feature",
    });
};

/**
 * Builds a GeoJSON feature from object or JSON
 * @param items Array of items to convert to GeoJSON Feature collection format
 * @param lonProperty Location of lon property
 * @param latProperty Location of lat property
 * @returns {IGeoJSONFeatureCollection} GeoJSON feature collection - object with features and type = "FeatureCollection"
 */
export const buildGeojsonFeatureCollection =
    (items: any, lonProperty: string, latProperty: string): IGeoJSONFeatureCollection =>
        ({
            features: items.map((item: any) => buildGeojsonFeature(item, lonProperty, latProperty)),
            type: "FeatureCollection",
        });
