import {VehiclePositions} from "data-platform-schema-definitions";
import {SequelizeModel} from "./SequelizeModel";

export class VehiclePositionsPositionsViewModel extends SequelizeModel {

    public constructor() {
        super("VehiclePositionsPositionsViewModel", "v_vehiclepositions_last_position",
            VehiclePositions.positions.outputSequelizeAttributes, {
                timestamps: false,
            });
    }

    public GetAll = async (): Promise<any> => {
        return null;
    }

    public GetOne = async (id: number): Promise<object | null> => {
        return null;
    }
}
