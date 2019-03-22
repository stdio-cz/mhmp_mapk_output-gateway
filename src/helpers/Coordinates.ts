import CustomError from "./errors/CustomError";
import log from "./Logger";

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

export const buildResponse = (item: any, lonProperty: string, latProperty: string): any => {
    console.log(item.toJSON);
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
