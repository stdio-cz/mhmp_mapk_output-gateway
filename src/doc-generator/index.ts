// Load reflection lib
import "@golemio/core/dist/shared/_global";

// To run this config preparation logic, run script `npm run build-apidocs`
//
// It creates 2 config files:
// "./src/doc-generator/generated-merge-configs/openapi-merge-config.json"
// "./src/doc-generator/generated-merge-configs/public-openapi-merge-config.json"
//
// To make apiDocs merge using prepared configs:
// npx openapi-merge-cli --config './src/doc-generator/generated-merge-configs/openapi-merge-config.json'
// npx openapi-merge-cli --config './src/doc-generator/generated-merge-configs/public-openapi-merge-config.json'
//
// It creates 2 swagger files:
// "./docs/generated/openapi.json"
// "./docs/generated/public-openapi.json"
const { log } = require("@golemio/core/dist/output-gateway/Logger");
import { ErrorHandler } from "@golemio/core/dist/shared/golemio-errors";
import { MergeConfigPreparator } from "./MergeConfigPreparator";

const mergeConfigPreparator = new MergeConfigPreparator();

mergeConfigPreparator
    .makeConfigs()
    .then((result) => log.info(result))
    .catch((error) => {
        ErrorHandler.handle(error, log);
    });

// next steps:
// npx openapi-merge-cli --config './src/doc-generator/generated-merge-configs/openapi-merge-config.json'
// npx openapi-merge-cli --config './src/doc-generator/generated-merge-configs/public-openapi-merge-config.json'
