import { GTFSCalendarModel } from "./GTFSCalendarModel";
import { GTFSRoutesModel } from "./GTFSRoutesModel";
import { GTFSShapesModel } from "./GTFSShapesModel";
import { GTFSStopModel } from "./GTFSStopModel";
import { GTFSStopTimesModel } from "./GTFSStopTimesModel";
import { GTFSTripsModel } from "./GTFSTripsModel";

const models: any = {
    GTFSCalendarModel: new GTFSCalendarModel(),
    GTFSRoutesModel: new GTFSRoutesModel(),
    GTFSShapesModel: new GTFSShapesModel(),
    GTFSStopModel: new GTFSStopModel(),
    GTFSStopTimesModel: new GTFSStopTimesModel(),
    GTFSTripsModel: new GTFSTripsModel(),
};

for (const type in models) {
    if ({}.hasOwnProperty.call(models[type], "Associate")) {
        models[type].Associate(models);
    }
}

export { models };
