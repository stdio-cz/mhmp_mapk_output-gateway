import { SharedCars } from "@golemio/shared-cars/dist/schema-definitions";
import { Meteosensors } from "@golemio/meteosensors/dist/schema-definitions";
import { TrafficCameras } from "@golemio/traffic-cameras/dist/schema-definitions";
import { PublicToilets } from "@golemio/public-toilets/dist/schema-definitions";
import { Parkings } from "@golemio/parkings/dist/schema-definitions";
import { BicycleParkings } from "@golemio/bicycle-parkings/dist/schema-definitions";

// Configuration of the routes to be dynamically created by RouterBuilder
const generalRoutes = [
    {
        collectionName: SharedCars.mongoCollectionName,
        expire: 30000,
        name: SharedCars.name,
        schema: SharedCars.outputMongooseSchemaObject,
    },
    {
        collectionName: Meteosensors.mongoCollectionName,
        name: Meteosensors.name,
        schema: Meteosensors.outputMongooseSchemaObject,
    },
    {
        collectionName: TrafficCameras.mongoCollectionName,
        name: TrafficCameras.name,
        schema: TrafficCameras.outputMongooseSchemaObject,
    },
    {
        collectionName: PublicToilets.mongoCollectionName,
        name: PublicToilets.name,
        schema: PublicToilets.outputMongooseSchemaObject,
    },
    {
        collectionName: Parkings.mongoCollectionName,
        history: {
            collectionName: Parkings.history.mongoCollectionName,
            name: Parkings.history.name,
            schema: Parkings.history.outputMongooseSchemaObject,
        },
        name: Parkings.name,
        schema: Parkings.outputMongooseSchemaObject,
    },
    {
        collectionName: BicycleParkings.mongoCollectionName,
        name: BicycleParkings.name,
        schema: BicycleParkings.outputMongooseSchemaObject,
    },
];

export { generalRoutes };
