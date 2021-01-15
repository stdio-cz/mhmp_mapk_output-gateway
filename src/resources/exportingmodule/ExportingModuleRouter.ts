import { useCacheMiddleware } from "../../core/redis";
import { BaseRouter } from "../../core/routes/BaseRouter";

import { log } from "../../core/Logger";

import {
    NextFunction,
    Request,
    Response,
    Router,
} from "express";

import * as bodyParser from "body-parser";

import {
    ExportingModuleModel,
    IQuerySchema,
    ITableSchema,
} from "./ExportingModuleModel";

import { parse, Transform } from "json2csv";

import { Readable } from "stream";

import { Field, RuleGroupType } from "react-querybuilder";

export interface IInputSchema {
    where: string;
    table_schema: string;
    column_name: string;
    is_nullable: string;
    data_type: string;
}

export interface IRequestBody {
    builderQuery: RuleGroupType;
    columns: string[];
    groupBy: string[];
    limit: number;
    offset: number;
    order: Array<{
        direction: string;
        column: string;
    }>;
}

export class ExportingModuleRouter extends BaseRouter {
    public router: Router = Router();

    protected exportingModuleModel: ExportingModuleModel = new ExportingModuleModel();

    private auditFields = [
        "create_batch_id",
        "created_at",
        "created_by",
        "update_batch_id",
        "updated_at",
        "updated_by",
    ];

    public constructor() {
        super();
        this.initRoutes();
    }

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        const transformStream = new Transform({}, { highWaterMark: 8192 });
        let body: IRequestBody;

        try {
            if (typeof req.body === "string") {
                body = JSON.parse(req.body);
            } else {
                body = req.body;
            }

            this.checkBody(body);

        } catch (err) {
            log.error(err);
            return res.status(400).send(err.message);
        }

        try {
            const dataStream = new Readable();
            dataStream._read = () => {
                // _read is required but you can noop it
            };

            // maybe should be stream - we'll see
            const data = await this.getData({
                builderQuery: body.builderQuery,
                columns: body.columns,
                groupBy: body.groupBy,
                limit: body.limit,
                offset: body.offset,
                order: body.order,
                table: req.params.resource,
            });

            res.set("Content-Type", "application/octet-stream");
            res.attachment(`${req.params.resource}.csv`);

            if (Array.isArray(data) && data.length > 0) {
                dataStream.pipe(transformStream).pipe(res);
                dataStream.push(JSON.stringify(data));
            } else {
                dataStream.pipe(transformStream).pipe(res);
            }

            dataStream.push(null);
        } catch (err) {
            log.error(err);
            return res.status(400).send(err.message);
        }
    }

    public getMetaData = async (req: Request, res: Response, next: NextFunction) => {
        const tableName: string = req.params.resource;
        try {
            const data = await this.exportingModuleModel.getTableMetadata(tableName);
            res.setHeader("content-type", "application/json; charset=utf-8");
            res.status(200).send(this.transformMeta(data));
        } catch (err) {
            return next(err);
        }

    }

    public getPreview = async (req: Request, res: Response, next: NextFunction) => {
        let body: IRequestBody;

        try {
            if (typeof req.body === "string") {
                body = JSON.parse(req.body);
            } else {
                body = req.body;
            }

            this.checkBody(body);

        } catch (err) {
            log.error(err);
            return res.status(400).send(err.message);
        }

        try {
            const data = await this.getData({
                builderQuery: body.builderQuery,
                columns: body.columns,
                groupBy: body.groupBy,
                limit: 20,
                offset: body.offset,
                order: body.order,
                table: req.params.resource,
            });

            res.setHeader("content-type", "text/plain; charset=utf-8");

            if (Array.isArray(data) && data.length > 0) {
                return res.status(200).send(parse(data));
            } else {
                return res.status(200).send("");
            }

        } catch (err) {
            log.error(err);
            return res.status(400).send(err.message);
        }
    }

    private checkBody = (body: any) => {
        if (body) {
            if (!body.builderQuery) {
                throw new Error("builderQuery parameter is required");
            }
            if (!body.columns) {
                throw new Error("columns parameter is required");
            }
        }
    }

    private catchJsonError = (
        error: any,
        req: any,
        res: any,
        next: any) => {
        if (error instanceof SyntaxError) {
            return res.status(400).send(`Invalid input: ${error}`);
        } else {
          next();
        }
      }

    private initRoutes = (expire?: number | string): void => {
        this.router.post("/:resource/preview",
            bodyParser.json(),
            this.catchJsonError,
            this.getPreview,
        );

        this.router.post("/:resource/data",
            bodyParser.json(),
            this.catchJsonError,
            this.getAll,
        );

        this.router.get("/:resource/meta",
            useCacheMiddleware(expire),
            this.getMetaData,
        );
    }

    private getData = async (options: IQuerySchema) => {
        return await this.exportingModuleModel.getData({
            builderQuery: options.builderQuery,
            columns: options.columns,
            groupBy: options.groupBy,
            limit: options.limit,
            offset: options.offset,
            order: options.order,
            table: options.table,
        });
    }

    private transformMeta = (data: ITableSchema[]): Field[] => {
        const out: Field[] = [];
        data.forEach((field: ITableSchema) => {
            if (!this.auditFields.includes(field.column_name)) {
                // tslint:disable: max-line-length object-literal-sort-keys
                out.push({
                    name: field.column_name, // REQUIRED - the field name
                    label: field.column_name, // REQUIRED - the field label
                    // operators: { name: string; label: string; }[]; // Array of operators (if not provided, then `getOperators()` will be used)
                    valueEditorType: this.getEditorType(field.data_type).type, // 'text' | 'select' | 'checkbox' | 'radio' | null; // Value editor type for this field (if not provided, then `getValueEditorType()` will be used)
                    inputType: this.getEditorType(field.data_type).inputType,
                    // values: { name: string; label: string; }[]; // Array of values, applicable when valueEditorType is 'select' or 'radio' (if not provided, then `getValues()` will be used)
                    // defaultValue?: any; // Default value for this field (if not provided, then `getDefaultValue()` will be used)
                    // placeholder?: string; // Value to be displayed in the placeholder of the text field
                });
                // tslint:enable
            }
        });
        return out;
    }

    private getEditorType = (inputType: string): any => {
        switch (inputType) {
            case "boolean":
            case "bool":
                return {
                    type: "checkbox",
                };
            case "bigint":
            case "integer":
            case "real":
            case "smallint":
                return {
                    inputType: "number",
                    type: "text",
                };
            default:
                return {
                    inputType: "text",
                    type: "text",
                };
        }
    }
}

const exportingModuleRouter: Router = new ExportingModuleRouter().router;

export { exportingModuleRouter };
