/**
 * app/controllers/ParkingsController.ts
 *
 * Controller /LOGIC LAYER/: Performs application logic, uses model to retrieve data. Manipulates and combines data.
 */

import CustomError from "../helpers/errors/CustomError";
import Parking from "../models/Parking";

const errorLog = require("debug")("data-platform:error");
const log = require("debug")("data-platform:output-gateway");

export class ParkingsController {

    private model = new Parking();

    public GetAll = async (limit?: number, offset?: number) => {
        return await this.model.GetAll(limit, offset);
    }

    public GetByCoordinates = async (lat: number, lng: number, range?: number, limit?: number, offset?: number ) => {
        return await this.model.GetByCoordinates(lat, lng, range, limit, offset);
    }

    /**
     * Retrieve one entry from the model, if it doesn't exist, return Not Found Error
     * @param inId Id of the entity to be retrieved
     * @throws Javascript Error if nothing was found by the id
     */
    public GetOne = async (id: number): Promise<object> => {
        const found = await this.model.GetOne(id);
        if (!found || found instanceof Array && found.length === 0) {
            throw new CustomError("Parking not found", true, 404);
        } else {
            return found;
        }
    }
}
