/* app/models/index.ts */

import {GTFSStopModel} from "./GTFSStopModel";
import {GTFSStopTimesModel} from "./GTFSStopTimesModel";
import {GTFSTripsModel} from "./GTFSTripsModel";

const models: any = {
    GTFSStopModel: new GTFSStopModel(),
    GTFSStopTimesModel: new GTFSStopTimesModel(),
    GTFSTripsModel: new GTFSTripsModel(),
};

for (const type in models) {
    if ({}.hasOwnProperty.call(models[type], "Associate")) {
        models[type].Associate(models);
    }
}

export {models};
export * from "./ParkingsModel";
export * from "./GeoJsonModel";
export * from "./ParkingZonesModel";
export * from "./VehiclePositionsModel";
