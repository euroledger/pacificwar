"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseUnit = exports.BaseSize = void 0;
const Hex_1 = require("../scenarios/Hex");
const AbstractUnit_1 = require("./AbstractUnit");
var BaseSize;
(function (BaseSize) {
    BaseSize["Large"] = "Large";
    BaseSize["Small"] = "Small";
})(BaseSize = exports.BaseSize || (exports.BaseSize = {}));
class BaseUnit extends AbstractUnit_1.AbstractUnit {
    constructor(options) {
        super(options.name, options.type, options.side, options.id, 0, options.aaStrength, options.hits ? options.hits : 0);
        this.size = options.size;
        this.hex = new Hex_1.Hex(options.hexLocation);
        this.launchCapacity = options.launchCapacity;
    }
    get Size() {
        return this.size;
    }
    get Hex() {
        return this.hex;
    }
    print() {
        return `${this.Id} SIZE ${this.size}`;
    }
}
exports.BaseUnit = BaseUnit;
