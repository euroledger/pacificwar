"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskForce = void 0;
const main_1 = require("../main");
const GameStatus_1 = require("../scenarios/GameStatus");
const Interfaces_1 = require("../units/Interfaces");
const illegalCoreTypes = ['CVE', 'ST', 'CA', 'CL', 'DE']; // DD can sometimes be allowed ie if it is carrying troops
const illegalScreenTypes = ['CV', 'CVL', 'CVS'];
class TaskForce {
    constructor(options) {
        this.core = new Array();
        this.screen = new Array();
        if (options) {
            if (options.core) {
                for (const ship of options.core) {
                    this.addUnitToCore(ship);
                }
            }
            if (options.screen) {
                for (const ship of options.screen) {
                    this.addUnitToScreen(ship);
                }
            }
            this.side = options.side;
            this.taskForceId = options.taskForceId;
        }
    }
    get Core() {
        return this.core;
    }
    get Screen() {
        return this.screen;
    }
    set TaskForceId(id) {
        this.taskForceId = id;
    }
    get TaskForceId() {
        return this.taskForceId;
    }
    get Side() {
        return this.side;
    }
    addUnitToCore(unit) {
        if (this.unitAlreadyInTF(unit)) {
            throw Error(`Unit ${unit.Id} already exists in the task force`);
        }
        if (this.illegalCoreUnit(unit)) {
            throw Error(`Unit ${unit.Id} cannot be in core`);
        }
        if (unit.isCapitalShip() && this.tooManyCapitalShips()) {
            throw Error(`Cannot add unit ${unit.Id} to TF: capital ship limit (6) reached`);
        }
        if (!unit.isCapitalShip() && this.tooManyNonCapitalShips()) {
            throw Error(`Cannot add unit ${unit.Id} to TF: Non-capital ship limit (4) reached`);
        }
        this.core.push(unit);
    }
    addUnitToScreen(unit) {
        if (this.unitAlreadyInTF(unit)) {
            throw Error(`Unit ${unit.Id} already exists in the task force`);
        }
        if (this.illegalScreenUnit(unit)) {
            throw Error(`Unit ${unit.Id} cannot be in screen`);
        }
        if (this.core.length === this.screen.length) {
            throw Error(`Cannot add unit ${unit.Id} to screen - would make screen size bigger than core size`);
        }
        if (unit.isCapitalShip() && this.tooManyCapitalShips()) {
            throw Error(`Cannot add unit ${unit.Id} to TF: capital ship limit (6) reached`);
        }
        if (!unit.isCapitalShip() && this.tooManyNonCapitalShips()) {
            throw Error(`Cannot add unit ${unit.Id} to TF: Non-capital ship limit (4) reached`);
        }
        if (this.screen.find((x) => x.Id === unit.Id)) {
            throw Error(`Cannot add ${unit.Id} as it is already in the TF`);
        }
        this.screen.push(unit);
    }
    removeUnitFromCoreById(unitId) {
        // check removing unit from core will not make core < screen
        if (this.core.find((x) => x.Id === unitId) &&
            this.core.length === this.screen.length) {
            throw Error(`Cannot remove Unit ${unitId} as core would contain less units than screen`);
        }
        const before = this.core.length;
        this.core = this.core.filter((coreUnit) => coreUnit.Id != unitId);
        const after = this.core.length;
        if (before === after) {
            throw Error(`Unit ${unitId} not found in TaskForce ${this.TaskForceId}`);
        }
    }
    removeUnitFromScreenById(unitId) {
        const before = this.screen.length;
        this.screen = this.screen.filter((screenUnit) => screenUnit.Id != unitId);
        const after = this.screen.length;
        if (before === after) {
            throw Error(`Unit ${unitId} not found in TaskForce ${this.TaskForceId}`);
        }
    }
    // get all the air units from carriers in the task force
    get AirUnits() {
        const allUnits = this.core.concat(this.screen);
        const airUnits = new Array();
        for (const unit of allUnits) {
            if (unit.Id.startsWith('CV')) {
                // get the Carrier Air Unit for that carrier
                const carrierAirGroup = main_1.Main.Mapper.getUnitById(this.side, unit.AirGroup);
                airUnits.push(carrierAirGroup);
            }
        }
        return airUnits;
    }
    illegalCoreUnit(unit) {
        if (unit.Side === Interfaces_1.Side.Allied && unit.Id.startsWith('DD')) {
            return true;
        }
        if (unit.Side === Interfaces_1.Side.Japan &&
            unit.Id.startsWith('DD') &&
            unit.Loaded === false) {
            return true;
        }
        if (unit.Side === Interfaces_1.Side.Allied &&
            unit.Id.startsWith('APD') &&
            unit.Loaded === false) {
            return true;
        }
        if (illegalCoreTypes.find((x) => unit.Id.includes(x))) {
            return true;
        }
        return false;
    }
    unitAlreadyInTF(unit) {
        if (this.screen.find((x) => x.Id === unit.Id) ||
            this.core.find((x) => x.Id === unit.Id)) {
            return true;
        }
        return false;
    }
    illegalScreenUnit(unit) {
        if (illegalScreenTypes.find((x) => unit.Id.includes(x))) {
            return true;
        }
        return false;
    }
    tooManyCapitalShips() {
        const capitalShipsInCore = this.core.filter((coreUnit) => coreUnit.isCapitalShip());
        const capitalShipsInScreen = this.screen.filter((screenUnit) => screenUnit.isCapitalShip());
        if (capitalShipsInCore.length + capitalShipsInScreen.length === 6) {
            return true;
        }
        return false;
    }
    tooManyNonCapitalShips() {
        const numNonCapitalShipsInCore = this.core.filter((coreUnit) => !coreUnit.isCapitalShip()).length;
        const numNonCapitalShipsInScreen = this.screen.filter((screenUnit) => !screenUnit.isCapitalShip()).length;
        if (numNonCapitalShipsInCore + numNonCapitalShipsInScreen === 4) {
            return true;
        }
        return false;
    }
    print() {
        GameStatus_1.GameStatus.print(`\t\t         ${this.Side} TASK FORCE ${this.taskForceId}`);
        GameStatus_1.GameStatus.print('=================================================================================================');
        GameStatus_1.GameStatus.print(`\t\tCORE\t\t\tSCREEN`);
        GameStatus_1.GameStatus.print(`\t\t----\t\t\t------`);
        const numRowsToDisplay = Math.max(this.Core.length, this.Screen.length);
        for (let i = 0; i < numRowsToDisplay; i++) {
            let coreShipStr = '';
            let screenShipStr = '';
            if (i < this.Core.length) {
                coreShipStr = `${this.Core[i].Id}-${this.Core[i].Name}`;
            }
            if (i < this.Screen.length) {
                screenShipStr = `${this.Screen[i].Id}-${this.Screen[i].Name}`;
            }
            GameStatus_1.GameStatus.print(`\t\t${coreShipStr}\t\t${screenShipStr}`);
        }
    }
}
exports.TaskForce = TaskForce;
