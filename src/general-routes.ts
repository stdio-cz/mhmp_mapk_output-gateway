import { Meteosensors } from "@golemio/meteosensors/dist/schema-definitions";
import { TrafficCameras } from "@golemio/traffic-cameras/dist/schema-definitions";

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
];

export { generalRoutes };
