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
    order?: Array<{ direction: string; collumn: string; }>;
    table: string;
}

export class ExportingModuleModel {

    public async getData(options: IQuerySchema): Promise<any> {
        const query = this.getQuery(options);
        return (await sequelizeReadOnlyConnection.query(
            query.query,
            {
                bind: query.params,
                type: QueryTypes.SELECT,
            },
        )) || [];
    }

    public async getTableMetadata(tableName: string): Promise<ITableSchema[]> {
        return (await sequelizeReadOnlyConnection.query(`SELECT
            table_catalog, table_schema, column_name, is_nullable, data_type, data_type
        FROM
            information_schema.columns
        WHERE
            table_name = '${tableName}';`,
        ))[0] || [];
    }

    private getQuery = ( options: IQuerySchema ): {
        query: string;
        params: string[];
    }   => {
        const reactQuery = formatQuery(options.builderQuery, "parameterized") as {
            sql: string;
            params: string[];
        };

        let query = `SELECT
            ${((options.columns || []).length > 0 ? options.columns : ["*"]).join(",")}
        FROM ${options.table} `;

        let i = 0;

        // empty query is parsed as "()"
        if (reactQuery?.sql && reactQuery.sql !== "()") {
            query += " WHERE ";
            query += reactQuery.sql.replace(/\?/g, () => {
                return `$${++i}`;
            });
        }

        if (options.groupBy) {
            query += `
            GROUP BY ${options.groupBy.join(",")}
            `;
        }

        if (options.order) {
            const orders: string[] = [];
            options.order.forEach((order: {
                direction: string;
                collumn: string;
            }) => {
               orders.push(`${order.collumn} ${order.direction}`);
            });
            query += `
            ORDER BY ${orders.join(",")}
            `;
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
