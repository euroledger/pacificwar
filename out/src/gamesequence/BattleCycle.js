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
exports.DefaultBattleCycle = exports.BattleCyclePhase = exports.NavalCombatCyclePhase = void 0;
const LightingConditionDisplay_1 = require("../displays/LightingConditionDisplay");
var NavalCombatCyclePhase;
(function (NavalCombatCyclePhase) {
    NavalCombatCyclePhase[NavalCombatCyclePhase["NavalCombatDetermination"] = 0] = "NavalCombatDetermination";
    NavalCombatCyclePhase[NavalCombatCyclePhase["NavalCombat1"] = 1] = "NavalCombat1";
    NavalCombatCyclePhase[NavalCombatCyclePhase["NavalCombat2"] = 2] = "NavalCombat2";
    NavalCombatCyclePhase[NavalCombatCyclePhase["NavalCombat3"] = 3] = "NavalCombat3";
})(NavalCombatCyclePhase = exports.NavalCombatCyclePhase || (exports.NavalCombatCyclePhase = {}));
var BattleCyclePhase;
(function (BattleCyclePhase) {
    BattleCyclePhase[BattleCyclePhase["Lighting"] = 0] = "Lighting";
    BattleCyclePhase[BattleCyclePhase["AdvantageDetermination"] = 1] = "AdvantageDetermination";
    BattleCyclePhase[BattleCyclePhase["AdvantageMovement"] = 2] = "AdvantageMovement";
    BattleCyclePhase[BattleCyclePhase["AdvantageAirMission"] = 3] = "AdvantageAirMission";
    BattleCyclePhase[BattleCyclePhase["NavalCombat"] = 4] = "NavalCombat";
    BattleCyclePhase[BattleCyclePhase["Bombardment"] = 5] = "Bombardment";
    BattleCyclePhase[BattleCyclePhase["Demolition"] = 6] = "Demolition";
    BattleCyclePhase[BattleCyclePhase["GroundCombat"] = 7] = "GroundCombat";
    BattleCyclePhase[BattleCyclePhase["AirfieldRepair"] = 8] = "AirfieldRepair";
    BattleCyclePhase[BattleCyclePhase["Rally"] = 9] = "Rally";
    BattleCyclePhase[BattleCyclePhase["DisadvantageMovement"] = 10] = "DisadvantageMovement";
    BattleCyclePhase[BattleCyclePhase["DisadvantgeAirMission"] = 11] = "DisadvantgeAirMission";
    BattleCyclePhase[BattleCyclePhase["JointActivationDeactivation"] = 12] = "JointActivationDeactivation";
    BattleCyclePhase[BattleCyclePhase["DetectionRemoval"] = 13] = "DetectionRemoval";
    BattleCyclePhase[BattleCyclePhase["DayMarkerAdjustment"] = 14] = "DayMarkerAdjustment"; // not in engagement scenarios
})(BattleCyclePhase = exports.BattleCyclePhase || (exports.BattleCyclePhase = {}));
class DefaultBattleCycle {
    constructor() {
        this.lightingConditionIncrement = 1; // may need to set this to 5 if the first battle cycle moves it to DAY PM
    }
    doSequenceOfPlay() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.lightingPhase();
            yield this.advantageDeterminationPhase();
            yield this.advantageMovementPhase();
            yield this.advantageAirMissionPhase();
        });
    }
    set LightingConditionIncrement(increment) {
        this.lightingConditionIncrement = increment;
    }
    lightingPhase() {
        return __awaiter(this, void 0, void 0, function* () {
            // increment the lighting according to the increment (usually 1)
            LightingConditionDisplay_1.LightingConditionDisplay.incrementLightingDisplay(this.lightingConditionIncrement);
        });
    }
    advantageDeterminationPhase() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    advantageMovementPhase() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    advantageAirMissionPhase() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    get LightingCondition() {
        return LightingConditionDisplay_1.LightingConditionDisplay.LightingCondition;
    }
    set LightingCondition(value) {
        LightingConditionDisplay_1.LightingConditionDisplay.LightingCondition = value;
    }
}
exports.DefaultBattleCycle = DefaultBattleCycle;
