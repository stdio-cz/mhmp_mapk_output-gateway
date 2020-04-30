import { BicycleCountersDetectionsModel } from "./BicycleCountersDetectionsModel";
import { BicycleCountersDirectionsModel } from "./BicycleCountersDirectionsModel";
import { BicycleCountersLocationsModel } from "./BicycleCountersLocationsModel";
import { BicycleCountersTemperaturesModel } from "./BicycleCountersTemperaturesModel";

export interface IBicycleCountersModels {
    BicycleCountersDetectionsModel: BicycleCountersDetectionsModel;
    BicycleCountersDirectionsModel: BicycleCountersDirectionsModel;
    BicycleCountersLocationsModel: BicycleCountersLocationsModel;
    BicycleCountersTemperaturesModel: BicycleCountersTemperaturesModel;
}

export interface IDetection {
    id: string;
    measurement_count: number;
    measured_from: string;
    measured_to: string;
    value: number;
}

export interface ILocation {
    id: string;
    name: string;
    route: string;
    updated_at: string;
    lat: number;
    lng: number;
    "directions.id": string;
    "directions.name": string;
    distance: string;
}

export interface IDirection {
    id: string;
    name: string;
}

export interface ILocationNormalized {
    directions: IDirection[];
    id: string;
    lat: number;
    lng: number;
    name: string;
    route: string;
    updated_at: string;
}

const models: IBicycleCountersModels = {
    BicycleCountersDetectionsModel: new BicycleCountersDetectionsModel(),
    BicycleCountersDirectionsModel: new BicycleCountersDirectionsModel(),
    BicycleCountersLocationsModel: new BicycleCountersLocationsModel(),
    BicycleCountersTemperaturesModel: new BicycleCountersTemperaturesModel(),
};

for (const type of Object.keys(models)) {
    const model = (models as any)[type];
    if (model.hasOwnProperty("Associate")) {
        model.Associate(models);
    }
}

export { models };
