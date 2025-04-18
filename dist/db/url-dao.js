"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlDao = void 0;
const database_1 = require("../database");
const table_description_1 = require("../helpers/table-description");
const url_1 = require("../model/url");
const ydb_sdk_1 = require("ydb-sdk");
class UrlDao {
    tableName = 'urls';
    async initTable() {
        let attempts = 3;
        while (attempts--) {
            try {
                await database_1.driver.tableClient.withSession(async (session) => {
                    await session.createTable(this.tableName, new table_description_1.TableDescription2()
                        .withColumns2([
                        { n: 'url_id', t: ydb_sdk_1.Types.UTF8 },
                        { n: 'path', t: ydb_sdk_1.Types.UTF8 },
                        { n: 'key', t: ydb_sdk_1.Types.UTF8 },
                    ])
                        .withPrimaryKey('url_id'));
                });
                break;
            }
            catch (e) {
                if (e.message?.includes('already exists'))
                    break;
                if (attempts === 0)
                    throw e;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }
    async save(url) {
        const query = `
            DECLARE $url_id AS Utf8;
            DECLARE $path AS Utf8;
            DECLARE $key AS Utf8;
            
            UPSERT INTO ${this.tableName} (url_id, path, key)
            VALUES ($url_id, $path, $key)
        `;
        await database_1.driver.tableClient.withSession(async (session) => {
            await session.executeQuery(query, {
                $url_id: ydb_sdk_1.TypedValues.utf8(url.urlId),
                $path: ydb_sdk_1.TypedValues.utf8(url.path),
                $key: ydb_sdk_1.TypedValues.utf8(url.key),
            });
        });
        return url.key;
    }
    async deleteByKey(key) {
        const query = `
            DECLARE $key AS Utf8;
            DELETE FROM ${this.tableName} WHERE key = $key
        `;
        await database_1.driver.tableClient.withSession(async (session) => {
            await session.executeQuery(query, { $key: ydb_sdk_1.TypedValues.utf8(key) });
        });
    }
    async findByKey(key) {
        const query = `
            DECLARE $key AS Utf8;
            SELECT * FROM ${this.tableName} WHERE key = $key
        `;
        let url = null;
        await database_1.driver.tableClient.withSession(async (session) => {
            const { resultSets } = await session.executeQuery(query, { $key: ydb_sdk_1.TypedValues.utf8(key) });
            if (resultSets[0].rows.length > 0) {
                const row = resultSets[0].rows[0];
                url = new url_1.Url(row.items[0].textValue, row.items[1].textValue, row.items[2].textValue);
            }
        });
        return url;
    }
}
exports.UrlDao = UrlDao;
//# sourceMappingURL=url-dao.js.map