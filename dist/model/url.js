"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Url = void 0;
const uuid_1 = require("uuid");
class Url {
    urlId;
    path;
    key;
    constructor(urlId = (0, uuid_1.v4)(), path, key) {
        this.urlId = urlId;
        this.path = path;
        this.key = key;
    }
}
exports.Url = Url;
//# sourceMappingURL=url.js.map