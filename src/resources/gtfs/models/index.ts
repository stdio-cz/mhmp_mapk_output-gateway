import { GTFSCalendarModel } from "./GTFSCalendarModel";
import { GTFSRoutesModel } from "./GTFSRoutesModel";
import { GTFSShapesModel } from "./GTFSShapesModel";
import { GTFSStopModel } from "./GTFSStopModel";
import { GTFSStopTimesModel } from "./GTFSStopTimesModel";
import { GTFSTripsModel } from "./GTFSTripsModel";

export interface IGTFSModels {
    GTFSCalendarModel: GTFSCalendarModel;
    GTFSRoutesModel: GTFSRoutesModel;
    GTFSShapesModel: GTFSShapesModel;
    GTFSStopModel: GTFSStopModel;
    GTFSStopTimesModel: GTFSStopTimesModel;
    GTFSTripsModel: GTFSTripsModel;
}

const models: IGTFSModels = {
    GTFSCalendarModel: new GTFSCalendarModel(),
    GTFSRoutesModel: new GTFSRoutesModel(),
    GTFSShapesModel: new GTFSShapesModel(),
    GTFSStopModel: new GTFSStopModel(),
    GTFSStopTimesModel: new GTFSStopTimesModel(),
    GTFSTripsModel: new GTFSTripsModel(),
};

for (const type of Object.keys(models)) {
    const model = (models as any)[type];
    if (model.hasOwnProperty("Associate")) {
        model.Associate(models);
    }
}

export { models };
