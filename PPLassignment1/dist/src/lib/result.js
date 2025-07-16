"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.either = exports.bind = exports.isFailure = exports.isOk = exports.makeFailure = exports.makeOk = void 0;
const makeOk = (value) => ({ tag: "Ok", value: value });
exports.makeOk = makeOk;
const makeFailure = (message) => ({ tag: "Failure", message: message });
exports.makeFailure = makeFailure;
const isOk = (r) => r.tag === "Ok";
exports.isOk = isOk;
const isFailure = (r) => r.tag === "Failure";
exports.isFailure = isFailure;
const bind = (r, f) => (0, exports.isOk)(r) ? f(r.value) : r;
exports.bind = bind;
const either = (r, ifOk, ifFailure) => (0, exports.isOk)(r) ? ifOk(r.value) : ifFailure(r.message);
exports.either = either;
//# sourceMappingURL=result.js.map