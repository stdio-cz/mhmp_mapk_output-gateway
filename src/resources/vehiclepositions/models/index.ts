import { VehiclePositionsLastPositionModel } from "./VehiclePositionsLastPositionModel";
import { VehiclePositionsPositionsModel } from "./VehiclePositionsPositionsModel";
import { VehiclePositionsTripsModel } from "./VehiclePositionsTripsModel";

const models: any = {
    VehiclePositionsLastPositionModel: new VehiclePositionsLastPositionModel(),
    VehiclePositionsPositionsModel: new VehiclePositionsPositionsModel(),
    VehiclePositionsTripsModel: new VehiclePositionsTripsModel(),
};

for (const type in models) {
    if ({}.hasOwnProperty.call(models[type], "Associate")) {
        models[type].Associate(models);
    }
}

export { models };
