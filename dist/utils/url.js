"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeFromBase64 = exports.encodeStringToBase62 = void 0;
const BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function encodeStringToBase62(input) {
    let number = 0;
    for (let i = 0; i < input.length; i++) {
        number = (number << 8) + input.charCodeAt(i);
    }
    return encodeBase62(number);
}
exports.encodeStringToBase62 = encodeStringToBase62;
function encodeBase62(number) {
    if (number === 0)
        return "0";
    let result = [];
    while (number > 0) {
        const remainder = number % 62;
        result.push(BASE62.charAt(remainder));
        number = Math.floor(number / 62);
    }
    return result.reverse().join('');
}
function decodeFromBase64(base64) {
    const decoded = atob(base64);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
        const char = decoded.charCodeAt(i).toString(16).padStart(2, '0');
        result += `%${char}`;
    }
    return decodeURIComponent(result);
}
exports.decodeFromBase64 = decodeFromBase64;
//# sourceMappingURL=url.js.map