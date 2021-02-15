import { CustomError } from "@golemio/errors";
import config from "../../config/config";
import { sequelizeReadOnlyConnection } from "../../core/database";
import { log } from "../../core/Logger";

import { QueryTypes } from "sequelize";

import { formatQuery, RuleGroupType } from "react-querybuilder";

import * as moment from "moment";

export interface ITableSchema {
    table_catalog: string;
    table_schema: string;
    column_name: string;
    is_nullable: string;
    data_type: string;
}

export interface IQuerySchema {
    builderQuery: RuleGroupType;
    columns: string[];
    groupBy?: string[];
    limit?: number;
    offset?: number;
    order?: Array<{ direction: string; column: string; }>;
    table: string;
}

export class ExportingModuleModel {

    public async getData(options: IQuerySchema): Promise<any> {
        const query = await this.getQuery(options);
        return (await sequelizeReadOnlyConnection.query(
            query.query,
            {
                bind: query.params,
                type: QueryTypes.SELECT,
            },
        )) || [];
    }

    public async getTableMetadata(tableName: string): Promise<ITableSchema[]> {
        const schema = await this.getDefaultSchema();

        return (await sequelizeReadOnlyConnection.query(`SELECT
            table_catalog, table_schema, column_name, is_nullable, data_type, data_type, table_schema
        FROM
            information_schema.columns
        WHERE
            table_name = '${tableName}' ${schema ? ` and table_schema = '${schema}' ` : "" };`,
        ))[0] || [];
    }

    private quoteColumns(rules: any[]): void {
        rules.forEach((rule: any) => {
            if (rule.field) {
                rule.field = `"${rule.field}"`;
            } else if (rule.rules && Array.isArray(rule.rules)) {
                this.quoteColumns(rule.rules);
            }
        });
    }

    private async getDefaultSchema(): Promise<string> {
        return (await sequelizeReadOnlyConnection.query(
            "select current_schema()",
            {
                type: QueryTypes.SELECT,
            },
        ))[0]?.current_schema || "";
    }

    private async getQuery( options: IQuerySchema ): Promise<{
        query: string;
        params: string[];
    }> {
        let reactQuery: {
            sql: string;
            params: string[];
        };

        const tableCols = (await this.getTableMetadata(options.table))
        .map((data: any) => data.column_name)
        .sort((a, b) => b.length - a.length);

        const schema = await this.getDefaultSchema();

        options.columns.forEach((col: string, index: number) => {
            for (const tableCol of tableCols) {
                if (col.indexOf(" as ") > -1 && (col.indexOf(tableCol) > -1 )) {
                    options.columns[index] = col.replace(new RegExp(tableCol, "g"), `"${tableCol}"`);
                    break;
                }
            }
        });

        if (Array.isArray(options.builderQuery?.rules)) {
            this.quoteColumns(options.builderQuery.rules);

            reactQuery = formatQuery(options.builderQuery, "parameterized") as {
                sql: string;
                params: string[];
            };
        } else {
            reactQuery = {
                params: [],
                sql: "",
            };
        }

        let query = `SELECT
            ${((options.columns || []).length > 0 ? options.columns : ["*"]).map((col: string) => {
                return (col !== "*"  && col.indexOf(" as ") < 0) ? `"${col}"` : `${col}`;
            }).join(" , ")}
        FROM ${schema ? `${schema}.` : ""}${options.table} `;

        let i = 0;

        // empty query is parsed as "()"
        if (reactQuery?.sql && reactQuery.sql !== "()") {
            query += " WHERE ";
            query += reactQuery.sql.replace(/\?/g, () => {
                return `$${++i}`;
            });
        }

        if (options.groupBy && Array.isArray(options.groupBy)) {
            query += `
            GROUP BY ${options.groupBy.map((group: string) => {
                return `"${group}"`;
            }).join(" , ")}
            `;
        }

        if (options.order && Array.isArray(options.order)) {
            const orders: string[] = [];
            options.order.forEach((order: {
                direction: string;
                column: string;
            }) => {
                if (order.column) {
                    orders.push(`"${order.column}" ${order.direction}`);
                }
            });

            const ordersJoined = orders.join(" , ");

            if (ordersJoined) {
                query += `
                ORDER BY ${ordersJoined}
                `;
            }
        }

        if (options.limit) {
            query += `
            LIMIT ${options.limit}
            `;
        }

        if (options.offset) {
            query += `
            OFFSET ${options.offset}
            `;
        }

        return {
            params: reactQuery.params,
            query,
        };
    }
}
