"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = exports.driver = exports.logger = void 0;
const ydb_sdk_1 = require("ydb-sdk");
exports.logger = (0, ydb_sdk_1.getLogger)();
async function initDb() {
    exports.logger.info('Driver initializing...');
    if (!process.env.ENDPOINT || !process.env.DATABASE) {
        throw new Error('Missing YDB connection parameters!');
    }
    let authService;
    if (process.env.LOCAL_DEVELOPMENT === 'true') {
        const saKeyFile = process.env.SA_KEY_FILE;
        if (!saKeyFile)
            throw new Error('SA_KEY_FILE is required for local development');
        const saCredentials = (0, ydb_sdk_1.getSACredentialsFromJson)(require('path').resolve(saKeyFile));
        authService = new ydb_sdk_1.IamAuthService(saCredentials);
    }
    else {
        authService = new ydb_sdk_1.MetadataAuthService();
    }
    exports.driver = new ydb_sdk_1.Driver({
        endpoint: process.env.ENDPOINT,
        database: process.env.DATABASE,
        authService: authService,
    });
    if (!(await exports.driver.ready(15000))) {
        throw new Error('Driver failed to initialize');
    }
    exports.logger.info('Driver ready');
}
exports.initDb = initDb;
//# sourceMappingURL=database.js.map