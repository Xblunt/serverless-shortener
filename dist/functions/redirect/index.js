"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const url_dao_1 = require("../../db/url-dao");
const database_1 = require("../../database");
async function handler(event, context) {
    try {
        await (0, database_1.initDb)();
        const urlDao = new url_dao_1.UrlDao();
        await urlDao.initTable();
        const key = event.queryStringParameters?.key;
        if (!key) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Query parameter 'key' is required." }),
                headers: { "Content-Type": "application/json" },
            };
        }
        const url = await urlDao.findByKey(key);
        if (!url) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'URL not found' }),
                headers: { 'Content-Type': 'application/json' }
            };
        }
        return {
            statusCode: 302,
            headers: { Location: url.path },
            body: ''
        };
    }
    catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
            headers: { 'Content-Type': 'application/json' }
        };
    }
}
exports.handler = handler;
//# sourceMappingURL=index.js.map