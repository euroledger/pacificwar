"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractUnit = exports.Type = exports.BaseSize = void 0;
const main_1 = require("../main");
const Interfaces_1 = require("./Interfaces");
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
class AbstractUnit {
    constructor(name, type, side, id, apCost, aaStrength, hits) {
        this.activationStatus = Interfaces_1.ActivationStatus.Unactivated;
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
    get Hits() {
        return this.hits;
    }
    get Name() {
        return this.name;
    }
    get Type() {
        return this.type;
    }
    get Id() {
        return this.id;
    }
    get AAStrength() {
        return this.aaStrength;
    }
    get Side() {
        return this.side;
    }
    isNavalUnit() {
        const keys = Object.keys(this);
        if (keys.includes('crippled')) {
            return true;
        }
        return false;
    }
    isAirUnit() {
        const keys = Object.keys(this);
        if (keys.includes('range')) {
            return true;
        }
        return false;
    }
    isBaseUnit() {
        const keys = Object.keys(this);
        if (keys.includes('size')) {
            return true;
        }
        return false;
    }
    get ActivationStatus() {
        return this.activationStatus;
    }
    set ActivationStatus(value) {
        this.activationStatus = value;
    }
    print() {
        main_1.logger.debug(`Unit name=${this.name} :: id=${this.id} :: side=${this.side} :: type=${this.type} :: AP Cost=${this.apCost} 
      :: AA Strength=${this.aaStrength} :: hits=${this.hits}`);
    }
}
exports.AbstractUnit = AbstractUnit;
