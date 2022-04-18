"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseUnit = exports.Type = exports.BaseSize = exports.Side = void 0;
const index_1 = require("../index");
var Side;
(function (Side) {
    Side["Japan"] = "Japan";
    Side["Allied"] = "Allied";
})(Side = exports.Side || (exports.Side = {}));
var BaseSize;
(function (BaseSize) {
    BaseSize["Large"] = "Large";
    BaseSize["Small"] = "Small";
})(BaseSize = exports.BaseSize || (exports.BaseSize = {}));
var Type;
(function (Type) {
    Type["Naval"] = "Naval";
    Type["Air"] = "Air";
    Type["Submarine"] = "Submarine";
    Type["Base"] = "Base";
})(Type = exports.Type || (exports.Type = {}));
class BaseUnit {
    constructor(name, type, side, id, apCost, aaStrength, hits) {
        this.name = name;
        this.type = type;
        this.side = side;
        this.id = id;
        this.apCost = apCost;
        this.aaStrength = aaStrength;
        this.hits = hits;
    }
    set Hits(hits) {
        this.hits = hits;
    }
    print() {
        index_1.logger.debug(`Unit name=${this.name} :: id=${this.id} :: side=${this.side} :: type=${this.type} :: AP Cost=${this.apCost} 
      :: AA Strength=${this.aaStrength} :: hits=${this.hits}`);
    }
}
exports.BaseUnit = BaseUnit;
