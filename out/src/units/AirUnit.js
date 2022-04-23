"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirUnit = void 0;
const AbstractUnit_1 = require("./AbstractUnit");
const Interfaces_1 = require("./Interfaces");
class AirUnit extends AbstractUnit_1.AbstractUnit {
    constructor(options) {
        super(options.name, options.type, options.side, options.id, options.apCost, options.aaStrength, options.hits);
        this.range = options.range;
        this.anStrength = options.anStrength;
        this.agStrength = options.agStrength;
        this.aircraftType = options.aircraftType;
        this.aircraftLevel = options.aircraftLevel;
        this.reverseAA = options.reverseAA;
        this.steps = options.steps;
    }
    get Range() {
        return this.range;
    }
    get AntiNavalStrength() {
        return this.anStrength;
    }
    get AntiGroundStrength() {
        return this.agStrength;
    }
    get AircraftType() {
        return this.aircraftType;
    }
    get AircraftLevel() {
        return this.aircraftLevel;
    }
    get ReverseAA() {
        return this.reverseAA;
    }
    get Steps() {
        return this.steps;
    }
    get Level() {
        return this.aircraftLevel;
    }
    get Hits() {
        return 6 - this.steps;
    }
    print() {
        const levelStr = this.AircraftType != Interfaces_1.AircraftType.LRA ? `-L${this.Level}` : ``;
        return `${this.Id} (${this.Steps})${this.AircraftType}${levelStr}`;
    }
}
exports.AirUnit = AirUnit;
