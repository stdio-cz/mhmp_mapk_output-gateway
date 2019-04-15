import { VehiclePositions } from "golemio-schema-definitions";
import { SequelizeModel } from "./../../../core/models/";

export class VehiclePositionsPositionsViewModel extends SequelizeModel {

    public constructor() {
        super(VehiclePositions.lastPositions.name, VehiclePositions.lastPositions.pgTableName,
            VehiclePositions.lastPositions.outputSequelizeAttributes, {
                timestamps: false,
            });
        this.sequelizeModel.removeAttribute("id");
        // Remove all audit fields from DB tables that are not needed in the output view
        this.sequelizeModel.removeAttribute("created_by");
        this.sequelizeModel.removeAttribute("update_batch_id");
        this.sequelizeModel.removeAttribute("create_batch_id");
        this.sequelizeModel.removeAttribute("updated_by");
        this.sequelizeModel.removeAttribute("created_at");
        this.sequelizeModel.removeAttribute("updated_at");
    }

    public GetAll = async (): Promise<any> => {
        return null;
    }

    public GetOne = async (id: number): Promise<object | null> => {
        return null;
    }
}
