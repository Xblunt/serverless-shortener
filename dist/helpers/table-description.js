"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableDescription2 = void 0;
const ydb_sdk_1 = require("ydb-sdk");
class TableDescription2 extends ydb_sdk_1.TableDescription {
    withColumns2(columns) {
        for (const column of columns) {
            this.columns.push(new ydb_sdk_1.Column(column.n, ydb_sdk_1.Types.optional(column.t)));
        }
        return this;
    }
}
exports.TableDescription2 = TableDescription2;
//# sourceMappingURL=table-description.js.map