import { VehiclePositionsLastPositionModel } from "./VehiclePositionsLastPositionModel";
import { VehiclePositionsPositionsModel } from "./VehiclePositionsPositionsModel";
import { VehiclePositionsTripsModel } from "./VehiclePositionsTripsModel";

export interface IVehiclePositionsModels {
    VehiclePositionsLastPositionModel: VehiclePositionsLastPositionModel;
    VehiclePositionsPositionsModel: VehiclePositionsPositionsModel;
    VehiclePositionsTripsModel: VehiclePositionsTripsModel;
}

const models: IVehiclePositionsModels = {
    VehiclePositionsLastPositionModel: new VehiclePositionsLastPositionModel(),
    VehiclePositionsPositionsModel: new VehiclePositionsPositionsModel(),
    VehiclePositionsTripsModel: new VehiclePositionsTripsModel(),
};

for (const type of Object.keys(models)) {
    const model = (models as any)[type];
    if (model.hasOwnProperty("Associate")) {
        model.Associate(models);
    }
}

export { models };
