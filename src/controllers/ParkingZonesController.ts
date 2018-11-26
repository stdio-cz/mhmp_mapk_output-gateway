/**
 * app/controllers/ParkingZonesController.ts
 *
 * Controller /LOGIC LAYER/: Performs application logic, uses model to retrieve data.
 * Manipulates, combines and transports data. 
 * Serves as a layer between (replaceable) Data layer (model) and (replaceable) Web Layer (routes)
 */

import CustomError from "../helpers/errors/CustomError";
import { ParkingZonesModel } from "../models";

const errorLog = require("debug")("data-platform:error");
const log = require("debug")("data-platform:output-gateway");

export class ParkingZonesController {

    private model = new ParkingZonesModel();

    public GetAll = async (limit?: number, offset?: number, updatedSince?: number) => {
        try {
            return await this.model.GetAll(limit, offset, updatedSince);
        } catch (err) {
            throw new CustomError("Database error", true, 500, err);
        }
    }

    public GetByCoordinates = async (   lat: number,
                                        lng: number,
                                        range?: number,
                                        limit?: number,
                                        offset?: number,
                                        updatedSince?: number,
    ) => {
        try {
            return await this.model.GetByCoordinates(lat, lng, range, limit, offset, updatedSince);
        } catch (err) {
            throw new CustomError("Database error", true, 500, err);
        }
    }

    /**
     * Retrieve one entry from the model, if it doesn't exist, return Not Found Error
     * @param inId Id of the entity to be retrieved
     * @throws Javascript Error if nothing was found by the id
     */
    public GetOne = async (id: number): Promise<object> => {
        const found = await this.model.GetOne(id);
        if (!found || found instanceof Array && found.length === 0) {
            throw new CustomError("Parking zone not found", true, 404);
        } else {
            return found;
        }
    }
}
