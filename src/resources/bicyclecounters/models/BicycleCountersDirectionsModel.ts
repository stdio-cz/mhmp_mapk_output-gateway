import { BicycleCounters } from "@golemio/schema-definitions";
import { IBicycleCountersModels } from ".";

import { SequelizeModel } from "./../../../core/models/";

export class BicycleCountersDirectionsModel extends SequelizeModel {

    public constructor() {
        super(BicycleCounters.directions.name, BicycleCounters.directions.pgTableName,
            BicycleCounters.directions.outputSequelizeAttributes);
    }

    public Associate = (model: IBicycleCountersModels) => {
        return null;
    }

    public GetAll = async (): Promise<any> => {
        return null;
    }

    public GetOne = async (id: number): Promise<object | null> => {
        return null;
    }

}
