import { resolve } from "dns";

const fg = require("fast-glob");
const fs = require("fs");
const { protectedTags } = require("./tagsConfig");

interface IOpenApiMergeConfig {
    inputs: [
        {
            inputFile: string;
            operationSelection?: {
                excludeTags: string[];
            };
        }
    ];
    output: string;
}

export class MergeConfigPreparator {
    private mergeConfig: IOpenApiMergeConfig;
    private mergeConfigPublic: IOpenApiMergeConfig;

    constructor() {
        // Init mergeconfig for all apiDocs
        this.mergeConfig = {
            inputs: [
                {
                    inputFile: "../../../src/doc-generator/openapi-title.yaml",
                },
            ],
            output: "../../../docs/generated/openapi.json",
        };

        this.mergeConfigPublic = {
            inputs: [
                {
                    inputFile: "../../../src/doc-generator/public-openapi-title.yaml",
                },
            ],
            output: "../../../docs/generated/public-openapi.json",
        };
    }

    public makeConfigs = async (): Promise<string | -1> => {
        // Get path for each module openapi.yaml
        const modulesDocsPathEntries = await fg(["node_modules/@golemio/**/docs/openapi.yaml"], { dot: true });

        modulesDocsPathEntries.forEach((element: string) => {
            this.mergeConfig.inputs.push({
                inputFile: `../../../${element}`,
            });

            this.mergeConfigPublic.inputs.push({
                inputFile: `../../../${element}`,
                operationSelection: {
                    excludeTags: protectedTags,
                },
            });
        });

        // Fill the configuration
        fs.writeFileSync(
            "./src/doc-generator/generated-merge-configs/openapi-merge-config.json",
            JSON.stringify(this.mergeConfig)
        );
        fs.writeFileSync(
            "./src/doc-generator/generated-merge-configs/public-openapi-merge-config.json",
            JSON.stringify(this.mergeConfigPublic)
        );

        return "✅ API documentation configs were prepared successfully";
    };
}
