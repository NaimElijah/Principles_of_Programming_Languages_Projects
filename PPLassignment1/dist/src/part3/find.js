"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnSquaredIfFoundEven_v3 = exports.returnSquaredIfFoundEven_v2 = exports.findResult = void 0;
const result_1 = require("../lib/result");
/* Library code */
const findOrThrow = (pred, a) => {
    for (let i = 0; i < a.length; i++) {
        if (pred(a[i]))
            return a[i];
    }
    throw "No element found.";
};
const findResultHelper = x => x === undefined ? (0, result_1.makeFailure)("No element found.") : (0, result_1.makeOk)(x);
const findResult = (pred, a) => findResultHelper(a.find(pred));
exports.findResult = findResult;
/* Client code */
const returnSquaredIfFoundEven_v1 = (a) => {
    try {
        const x = findOrThrow(x => x % 2 === 0, a);
        return x * x;
    }
    catch (e) {
        return -1;
    }
};
const returnSquaredIfFoundEven_v2 = (a) => (0, result_1.bind)((0, exports.findResult)((x) => x % 2 === 0, a), (x) => (0, result_1.makeOk)(x * x));
exports.returnSquaredIfFoundEven_v2 = returnSquaredIfFoundEven_v2;
const returnSquaredIfFoundEven_v3 = a => (0, result_1.either)((0, exports.findResult)((x) => x % 2 === 0, a), (x) => x * x, () => -1);
exports.returnSquaredIfFoundEven_v3 = returnSquaredIfFoundEven_v3;
//# sourceMappingURL=find.js.map