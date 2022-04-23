"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirMissionSchematic = exports.AirMissionType = void 0;
const GameStatus_1 = require("../scenarios/GameStatus");
const Utility_1 = require("../utils/Utility");
var AirMissionType;
(function (AirMissionType) {
    AirMissionType["AirStrike"] = "Air Strike";
    AirMissionType["AirSupremacy"] = "Air Supremacy";
    AirMissionType["Ferry"] = "Ferry";
    AirMissionType["Paradrop"] = "Paradrop";
})(AirMissionType = exports.AirMissionType || (exports.AirMissionType = {}));
class AirMissionSchematic {
    constructor(options) {
        this.coordinated = false;
        this.detected = false;
        this.allMissionUnitsAborted = false;
        this.missionAirUnits = options.missionAirUnits;
        this.startHex = options.startHex;
        this.targetHex = options.targetHex;
        this.airMissionType = options.airMissionType;
    }
    doAirMission() {
        return __awaiter(this, void 0, void 0, function* () {
            let airStrikeTargets;
            this.airMissionPreliminaryProcedure();
            this.moveMisionAirUnits();
            if (this.detected) {
                if (this.currentHex != this.targetHex) {
                    this.doInterceptionProcedure();
                    // add loop to continue movement
                }
                else {
                    airStrikeTargets = yield this.designateStrikeTargets();
                    this.capProcedure();
                    this.flakProcedure();
                    if (!this.allMissionUnitsAborted && airStrikeTargets) {
                        this.strikeStrafeProcedure(airStrikeTargets);
                    }
                }
            }
            airStrikeTargets = yield this.designateStrikeTargets();
            if (!airStrikeTargets) {
                throw Error("No air strike targets designated");
            }
            this.strikeStrafeProcedure(airStrikeTargets);
            this.flakProcedure();
            this.airMissionConclusionProcedure();
        });
    }
    isCoordinated(dieRoll) {
        if (this.airMissionType === AirMissionType.AirSupremacy ||
            this.missionAirUnits.length === 1) {
            return true;
        }
        if (this.airMissionType === AirMissionType.Ferry ||
            this.airMissionType === AirMissionType.Paradrop) {
            return false;
        }
        // coordination die roll
        const minLevelOfAirUnits = this.getLowestStatusLevelOfMissionAirUnits();
        GameStatus_1.GameStatus.print('\n');
        GameStatus_1.GameStatus.print('\t\t\tCoordination Die Roll => ', dieRoll);
        if (dieRoll <= minLevelOfAirUnits * 3) {
            GameStatus_1.GameStatus.print('\t\t\tMission is COORDINATED');
            return true;
        }
        GameStatus_1.GameStatus.print('\t\t\tMission is UNCOORDINATED');
        return false;
    }
    getLowestStatusLevelOfMissionAirUnits() {
        return Math.min(...this.missionAirUnits.map((airUnit) => airUnit.AircraftLevel));
    }
    airMissionPreliminaryProcedure(dieRoll) {
        GameStatus_1.GameStatus.print('\n');
        GameStatus_1.GameStatus.print('\t\t\tMission Type is', this.airMissionType);
        if (!dieRoll) {
            dieRoll = (0, Utility_1.getDieRoll)();
        }
        this.coordinated = this.isCoordinated(dieRoll);
    }
    doInterceptionProcedure() {
        return __awaiter(this, void 0, void 0, function* () {
            // todo
        });
    }
    moveMisionAirUnits() {
        return __awaiter(this, void 0, void 0, function* () {
            this.detectMisionAirUnits(this.targetHex);
            // todo
            // call detectMisionAirUnits in each hex - if there are enemy units the strike could be detected
        });
    }
    // in future this would involve air units moving hex by hex and possibly being detected before the target hex
    detectMisionAirUnits(hex) {
        return __awaiter(this, void 0, void 0, function* () {
            // only implemented for target hex initially
        });
    }
    designateStrikeTargets() {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    capProcedure() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    flakProcedure() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    strikeStrafeProcedure(airStrikeTargets) {
    }
    airMissionConclusionProcedure() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.AirMissionSchematic = AirMissionSchematic;
