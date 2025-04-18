import { driver, initDb } from '../database';

import { TableDescription2 } from '../helpers/table-description';
import { Url } from '../model/url';
import { TypedValues, Types } from 'ydb-sdk';

export class UrlDao {
    private readonly tableName = 'urls';

    async initTable() {
        let attempts = 3;
        while (attempts--) {
            try {
                await driver.tableClient.withSession(async (session) => {
                    await session.createTable(
                        this.tableName,
                        new TableDescription2()
                            .withColumns2([
                                { n: 'url_id', t: Types.UTF8 },
                                { n: 'path', t: Types.UTF8 },
                                { n: 'key', t: Types.UTF8 },
                            ])
                            .withPrimaryKey('url_id')
                    );
                });
                break;
            } catch (e) {
                if (e.message?.includes('already exists')) break;
                if (attempts === 0) throw e;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }
    

    async save(url: Url): Promise<string> {
        const query = `
            DECLARE $url_id AS Utf8;
            DECLARE $path AS Utf8;
            DECLARE $key AS Utf8;
            
            UPSERT INTO ${this.tableName} (url_id, path, key)
            VALUES ($url_id, $path, $key)
        `;
        
        await driver.tableClient.withSession(async (session) => {
            await session.executeQuery(query, {
                $url_id: TypedValues.utf8(url.urlId),
                $path: TypedValues.utf8(url.path),
                $key: TypedValues.utf8(url.key),
            });
        });
        
        return url.key;
    }

    async deleteByKey(key: string): Promise<void> {
        const query = `
            DECLARE $key AS Utf8;
            DELETE FROM ${this.tableName} WHERE key = $key
        `;
        
        await driver.tableClient.withSession(async (session) => {
            await session.executeQuery(query, { $key: TypedValues.utf8(key) });
        });
    }

    async findByKey(key: string): Promise<Url | null> {
        const query = `
            DECLARE $key AS Utf8;
            SELECT * FROM ${this.tableName} WHERE key = $key
        `;
        
        let url: Url | null = null;
        
        await driver.tableClient.withSession(async (session) => {
            const { resultSets } = await session.executeQuery(query, { $key: TypedValues.utf8(key) });
            
            if (resultSets[0].rows.length > 0) {
                const row = resultSets[0].rows[0];
                url = new Url(
                    row.items[0].textValue,
                    row.items[1].textValue,
                    row.items[2].textValue
                );
            }
        });
        
        return url;
    }
}