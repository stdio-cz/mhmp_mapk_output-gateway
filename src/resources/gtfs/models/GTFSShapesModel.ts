import { CustomError } from "@golemio/errors";
import { RopidGTFS } from "@golemio/schema-definitions";
import { IGTFSModels } from ".";
import { buildGeojsonFeatureCollection } from "../../../core/Geo";
import { SequelizeModel } from "../../../core/models";

export class GTFSShapesModel extends SequelizeModel {
    protected outputAttributes: string[] = [];

    public constructor() {
        super(RopidGTFS.shapes.name, RopidGTFS.shapes.pgTableName,
            RopidGTFS.shapes.outputSequelizeAttributes);

        this.outputAttributes = Object.keys(RopidGTFS.shapes.outputSequelizeAttributes);

        const auditColumns = [
            "created_by",
            "update_batch_id",
            "create_batch_id",
            "updated_by",
            "created_at",
            "updated_at",
        ];
        auditColumns.forEach((column) => {
            this.sequelizeModel.removeAttribute(column);
            this.outputAttributes.splice(this.outputAttributes.indexOf(column), 1);
        });
    }

    public Associate = (models: IGTFSModels) => {
        this.sequelizeModel.hasMany(models.GTFSTripsModel.sequelizeModel, {
            foreignKey: "trip_id",
        });
    }

    /** Retrieves all gtfs shapes
     * @param {object} [options] Options object with params
     * @param {number} [options.limit] Limit
     * @param {number} [options.offset] Offset
     * @returns Array of the retrieved records
     */
    public GetAll = async (options: {
        id?: string,
        limit?: number,
        offset?: number,
    } = {}): Promise<any> => {
        const { limit, offset, id } = options;
        try {

            const order: any = [];

            order.push([["shape_id", "asc"]]);
            const data = await this.sequelizeModel.findAll({
                limit,
                offset,
                order,
                where: { shape_id: id },
            });
            if (data.length === 0) {
                return;
            }
            return buildGeojsonFeatureCollection(data, "shape_pt_lon", "shape_pt_lat", true);
        } catch (err) {
            throw new CustomError("Database error", true, "GTFSShapesModel", 500, err);
        }
    }

    public GetOne = async (id: number): Promise<object | null> => {
        return null;
    }
}
