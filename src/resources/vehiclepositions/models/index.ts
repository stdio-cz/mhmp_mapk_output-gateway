import { VehiclePositionsPositionsModel } from "./VehiclePositionsPositionsModel";
import { VehiclePositionsPositionsViewModel } from "./VehiclePositionsPositionsViewModel";
import { VehiclePositionsTripsModel } from "./VehiclePositionsTripsModel";

const models: any = {
    VehiclePositionsPositionsModel: new VehiclePositionsPositionsModel(),
    VehiclePositionsPositionsViewModel: new VehiclePositionsPositionsViewModel(),
    VehiclePositionsTripsModel: new VehiclePositionsTripsModel(),
};

for (const type in models) {
    if ({}.hasOwnProperty.call(models[type], "Associate")) {
        models[type].Associate(models);
    }
}

export { models };
