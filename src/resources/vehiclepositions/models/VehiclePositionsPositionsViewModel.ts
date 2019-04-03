import { VehiclePositions } from "data-platform-schema-definitions";
import { SequelizeModel } from "./../../../core/models/";

export class VehiclePositionsPositionsViewModel extends SequelizeModel {

    public constructor() {
        super(VehiclePositions.lastPositions.name, VehiclePositions.lastPositions.pgTableName,
            VehiclePositions.lastPositions.outputSequelizeAttributes, {
                timestamps: false,
            });
        this.sequelizeModel.removeAttribute("id");
    }

    public GetAll = async (): Promise<any> => {
        return null;
    }

    public GetOne = async (id: number): Promise<object | null> => {
        return null;
    }
}
