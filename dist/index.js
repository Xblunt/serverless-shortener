"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const database_1 = require("./database");
const url_dao_1 = require("./db/url-dao");
const url_1 = require("./model/url");
const url_2 = require("./utils/url");
async function handler(event, context) {
    try {
        await (0, database_1.initDb)();
        const urlDao = new url_dao_1.UrlDao();
        await urlDao.initTable();
        const pathToShort = event.path;
        if (!pathToShort) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'path is required' }),
                headers: { 'Content-Type': 'application/json' }
            };
        }
        const base62Path = (0, url_2.encodeStringToBase62)(pathToShort);
        const url = new url_1.Url(undefined, pathToShort, base62Path);
        await urlDao.save(url);
        return {
            statusCode: 200,
            body: base62Path,
            headers: { 'Content-Type': 'text/plain' }
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