import CustomError from "./errors/CustomError";
import log from "./Logger";

export const parseCoordinates = (latlng: string, range: string) => {
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

    return Promise.resolve({lat, lng, range: ran});
};
