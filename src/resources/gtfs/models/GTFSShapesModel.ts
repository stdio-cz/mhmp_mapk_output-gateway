import {RopidGTFS} from "golemio-schema-definitions";
import {CustomError} from "../../../core/errors";
import {buildGeojsonFeature, buildGeojsonFeatureCollection} from "../../../core/Geo";
import {SequelizeModel} from "../../../core/models";

export class GTFSShapesModel extends SequelizeModel {

    public constructor() {
        super(RopidGTFS.shapes.name, RopidGTFS.shapes.pgTableName,
            RopidGTFS.shapes.outputSequelizeAttributes);
    }

    public Associate = (models: any) => {
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
        limit?: number,
        offset?: number,
    } = {}): Promise<any> => {
        const {limit, offset} = options;
        try {

            const order: any = [];

            order.push([["shape_id", "asc"]]);
            const data = await this.sequelizeModel.findAll({
                limit,
                offset,
                order,
            });
            return buildGeojsonFeatureCollection(data, "shape_pt_lon", "shape_pt_lat");
        } catch (err) {
            throw new CustomError("Database error", true, 500, err);
        }
    }

    /** Retrieves specific gtfs shape
     * @param {string} id Id of the shape
     * @returns Object of the retrieved record or null
     */
    public GetOne = async (id: string): Promise<any> => this
        .sequelizeModel
        .findByPk(id)
        .then((data) => {
            if (data) {
                return buildGeojsonFeature(data, "shape_pt_lon", "shape_pt_lat");
            }
            return null;
        })
}
