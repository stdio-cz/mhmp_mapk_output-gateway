import { Meteosensors } from "@golemio/meteosensors/dist/schema-definitions";
import { TrafficCameras } from "@golemio/traffic-cameras/dist/schema-definitions";
import { PublicToilets } from "@golemio/public-toilets/dist/schema-definitions";
import { BicycleParkings } from "@golemio/bicycle-parkings/dist/schema-definitions";

// Configuration of the routes to be dynamically created by RouterBuilder
const generalRoutes = [
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
        collectionName: BicycleParkings.mongoCollectionName,
        name: BicycleParkings.name,
        schema: BicycleParkings.outputMongooseSchemaObject,
    },
];

export { generalRoutes };
