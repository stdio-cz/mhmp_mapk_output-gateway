import {VehiclePositions} from "data-platform-schema-definitions";
import {SequelizeModel} from "./SequelizeModel";

export class VehiclePositionsPositionsModel extends SequelizeModel {

    public constructor() {
        super(VehiclePositions.positions.name, VehiclePositions.positions.pgTableName,
            VehiclePositions.positions.outputSequelizeAttributes);
        // todo - add some primary key to schema
        this.sequelizeModel.removeAttribute("id");
    }

    public Associate = (models: any) => {
        this.sequelizeModel.belongsTo(models.VehiclePositionsTripsModel.sequelizeModel, {
            foreignKey: "trips_id",
        });

        this.sequelizeModel.belongsTo(this.sequelizeModel, {
            foreignKey: "trips_id",
            targetKey: "trips_id",
        });
    }

    public GetAll = async (): Promise<any> => {
        return null;
    }

    public GetOne = async (id: number): Promise<object | null> => {
        return null;
    }
}
