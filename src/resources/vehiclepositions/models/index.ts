import { VehiclePositionsLastPositionModel } from "./VehiclePositionsLastPositionModel";
import { VehiclePositionsPositionsModel } from "./VehiclePositionsPositionsModel";
import { VehiclePositionsTripsModel } from "./VehiclePositionsTripsModel";
import { VehiclePositionsVehicleTypesModel } from "./VehiclePositionsVehicleTypesModel";

export interface IVehiclePositionsModels {
    VehiclePositionsLastPositionModel: VehiclePositionsLastPositionModel;
    VehiclePositionsPositionsModel: VehiclePositionsPositionsModel;
    VehiclePositionsTripsModel: VehiclePositionsTripsModel;
    VehiclePositionsVehicleTypesModel: VehiclePositionsVehicleTypesModel;
}

const models: IVehiclePositionsModels = {
    VehiclePositionsLastPositionModel: new VehiclePositionsLastPositionModel(),
    VehiclePositionsPositionsModel: new VehiclePositionsPositionsModel(),
    VehiclePositionsTripsModel: new VehiclePositionsTripsModel(),
    VehiclePositionsVehicleTypesModel: new VehiclePositionsVehicleTypesModel(),
};

for (const type of Object.keys(models)) {
    const model = (models as any)[type];
    if (model.hasOwnProperty("Associate")) {
        model.Associate(models);
    }
}

export { models };
