/* app/models/index.ts */

import {GTFSCalendarModel} from "./GTFSCalendarModel";
import {GTFSRoutesModel} from "./GTFSRoutesModel";
import {GTFSShapesModel} from "./GTFSShapesModel";
import {GTFSStopModel} from "./GTFSStopModel";
import {GTFSStopTimesModel} from "./GTFSStopTimesModel";
import {GTFSTripsModel} from "./GTFSTripsModel";
import {VehiclePositionsPositionsModel} from "./VehiclePositionsPositionsModel";
import {VehiclePositionsPositionsViewModel} from "./VehiclePositionsPositionsViewModel";
import {VehiclePositionsTripsModel} from "./VehiclePositionsTripsModel";

const models: any = {
    GTFSCalendarModel: new GTFSCalendarModel(),
    GTFSRoutesModel: new GTFSRoutesModel(),
    GTFSShapesModel: new GTFSShapesModel(),
    GTFSStopModel: new GTFSStopModel(),
    GTFSStopTimesModel: new GTFSStopTimesModel(),
    GTFSTripsModel: new GTFSTripsModel(),
    VehiclePositionsPositionsModel: new VehiclePositionsPositionsModel(),
    VehiclePositionsPositionsViewModel: new VehiclePositionsPositionsViewModel(),
    VehiclePositionsTripsModel: new VehiclePositionsTripsModel(),
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
