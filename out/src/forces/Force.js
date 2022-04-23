"use strict";
// this container holds ground units, bases, air units etc, non-activated naval units and
// store location as a hex objct
// hex object will have forces in it as well (two-way references)
Object.defineProperty(exports, "__esModule", { value: true });
exports.Force = void 0;
const GameStatus_1 = require("../scenarios/GameStatus");
const Interfaces_1 = require("../units/Interfaces");
class Force {
    constructor(options) {
        this.units = new Array();
        if (options) {
            if (options.units) {
                this.units = this.units.concat(options.units);
            }
            this.side = options.side;
            this.forceId = options.forceId;
            this.location = options.location;
        }
    }
    addUnitToForce(unit) {
        if (this.unitAlreadyInForce(unit)) {
            throw Error(`Unit ${unit.Id} already exists in the force`);
        }
        this.units.push(unit);
    }
    removeUnitFromForceById(unitId) {
        GameStatus_1.GameStatus.print(this.units);
        console.log();
        const found = this.units.find((unit) => unit.Id === unitId) != undefined;
        GameStatus_1.GameStatus.print("found = ", found);
        if (!found) {
            throw Error(`Unit ${unitId} not found in Force ${this.ForceId}`);
        }
        this.units = this.units.filter((unit) => unit.Id != unitId);
    }
    set ForceId(id) {
        this.ForceId = id;
    }
    get ForceId() {
        return this.forceId;
    }
    get Side() {
        return this.side;
    }
    get Units() {
        return this.units;
    }
    get Location() {
        return this.location;
    }
    getActivatedUnits() {
        return this.units.filter((unit) => unit.ActivationStatus === Interfaces_1.ActivationStatus.Activated);
    }
    getDeactivatedUnits() {
        return this.units.filter((unit) => unit.ActivationStatus === Interfaces_1.ActivationStatus.Deactivated);
    }
    getUnactivatedUnits() {
        return this.units.filter((unit) => unit.ActivationStatus === Interfaces_1.ActivationStatus.Unactivated);
    }
    unitAlreadyInForce(unit) {
        return this.units.find((x) => x.Id === unit.Id) != undefined;
    }
    get AirUnits() {
        return this.units.filter((x) => x.isAirUnit());
    }
    get NavalUnits() {
        return this.units.filter((x) => x.isNavalUnit());
    }
    get BaseUnit() {
        const base = this.units.filter((x) => x.isBaseUnit());
        if (base.length === 1) {
            return base[0];
        }
    }
    print() {
        GameStatus_1.GameStatus.print(`\t\t      ${this.Side} FORCE ${this.forceId} LOCATION ${this.location.HexNumber}`);
        GameStatus_1.GameStatus.print('=================================================================================================');
        if (this.BaseUnit) {
            GameStatus_1.GameStatus.print('\n');
            GameStatus_1.GameStatus.print(`\t\t    BASE UNIT: ${this.BaseUnit.print()}`);
            GameStatus_1.GameStatus.print('\n');
        }
        GameStatus_1.GameStatus.print(`\t\tNAVAL UNITS\t\t\t\tAIR UNITS`);
        GameStatus_1.GameStatus.print(`\t\t-----------\t\t\t\t---------`);
        const numRowsToDisplay = Math.max(this.NavalUnits.length, this.AirUnits.length);
        for (let i = 0; i < numRowsToDisplay; i++) {
            let navalUnitStr = '';
            let airUnitStr = '';
            if (i < this.NavalUnits.length) {
                navalUnitStr = `${this.NavalUnits[i].Id}-${this.NavalUnits[i].Name}`;
            }
            let tabs = '\t\t\t';
            if (navalUnitStr.length < 17) {
                tabs = '\t\t\t\t';
            }
            if (i < this.AirUnits.length) {
                airUnitStr = `${this.AirUnits[i].print()}`;
            }
            GameStatus_1.GameStatus.print(`\t\t${navalUnitStr}${tabs}${airUnitStr}`);
        }
    }
}
exports.Force = Force;
