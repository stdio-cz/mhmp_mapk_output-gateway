import { VehiclePositions } from "golemio-schema-definitions";
import { SequelizeModel } from "./../../../core/models/";

export class VehiclePositionsPositionsModel extends SequelizeModel {

    public constructor() {
        super(VehiclePositions.positions.name, VehiclePositions.positions.pgTableName,
            VehiclePositions.positions.outputSequelizeAttributes);
        // todo - add some primary key to schema
        this.sequelizeModel.removeAttribute("id");
    }

    public GetAll = async (): Promise<any> => {
        return null;
    }

    public GetOne = async (id: number): Promise<object | null> => {
        return null;
    }
}
