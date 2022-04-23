"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirNavalCombatResultsTable = exports.AirNavalCombatType = exports.TroopQualityCheck = void 0;
const main_1 = require("../main");
const Utility_1 = require("../utils/Utility");
exports.TroopQualityCheck = -1;
const zeroFour = -2;
var AirNavalCombatType;
(function (AirNavalCombatType) {
    AirNavalCombatType["CapvsUncoordinatedMission"] = "CAP vs UnCoordinated Mission";
    AirNavalCombatType["CapvsCoordinatedMission"] = "CAP vs Coordinated Mission";
    AirNavalCombatType["AirSupremacyvsCap"] = "Air Supremacy vs CAP";
    AirNavalCombatType["UncoordinatedStrikevsCAP"] = "UnCoordinated Strike vs CAP";
    AirNavalCombatType["CoordinatedStrikevsCAP"] = "Coordinated Strike vs CAP";
    AirNavalCombatType["UnimprovedFlakvsAir"] = "FLAK (Unimproved) vs Air";
    AirNavalCombatType["ImprovedFlakvsAir"] = "Improved FLAK vs Air";
    AirNavalCombatType["FAirvsNaval"] = "F Air vs Naval";
    AirNavalCombatType["TAirvsNaval"] = "T Air vs Naval";
    AirNavalCombatType["BAirvsNaval"] = "B Air vs Naval";
    AirNavalCombatType["AirvsInstallation"] = "Air vs Installation";
    AirNavalCombatType["AirvsGroundUnit"] = "Air vs Ground Unit";
    AirNavalCombatType["AirvsUnalertedAir"] = "Air vs Unalerted (Grounded) Air";
    AirNavalCombatType["LongRangevsNaval"] = "Long Range vs Naval";
    AirNavalCombatType["MediumRangvsNaval"] = "Mediun Range vs Naval";
    AirNavalCombatType["ShortRangevsNaval"] = "Short Range vs Naval";
    AirNavalCombatType["BombardmentvsInstallation"] = "Bombardment vs Installation";
    AirNavalCombatType["BombardmentvsGroundUnit"] = "Bombardment vs Ground Unit";
    AirNavalCombatType["SubOrNavalvsNaval"] = "Submarine or Naval vs Naval";
    AirNavalCombatType["NavalvsSubmarine"] = "Naval vs Submarine";
    AirNavalCombatType["NormalBombingFirst10"] = "NormalBombing (first 10 Uses)";
    AirNavalCombatType["FireBombing11"] = "FireBombing (starting with 11th Use)";
})(AirNavalCombatType = exports.AirNavalCombatType || (exports.AirNavalCombatType = {}));
const zeroMinus = [[zeroFour]];
const zero = [[1, 9], [0]];
const one = [[2, 9], [1], [0]];
const two = [[3, 9], [2], [1], [0]];
const three = [[4, 9], [3], [2], [1], [0]];
const four = [[5, 9], [4], [3], [2], [1], [0]];
const five = [[6, 9], [5], [4], [3], [2], [1], [0]];
const six = [[7, 9], [6], [5], [4], [3], [2], [1], [0]];
const seven = [[8, 9], [7], [6], [5], [4], [3], [2], [1], [0]];
const eight = [[9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
const nine = [[10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
const ten = [[10], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
const eleven = [[10], [10], [10], [9], [8], [7], [6], [5], [4], [3], [2], [0, 1]];
const twelve = [[10], [10], [10], [10], [9], [8], [7], [6], [5], [4], [3], [0, 2]];
const thirteen = [[10], [10], [10], [10], [10], [9], [8], [7], [6], [5], [4], [0, 3]];
const fourteen = [[10], [10], [10], [10], [10], [10], [9], [8], [7], [6], [5], [0, 4]];
const fifteen = [[10], [10], [10], [10], [10], [10], [10], [9], [8], [7], [6], [0, 5]];
const sixteen = [[10], [10], [10], [10], [10], [10], [10], [10], [9], [8], [7], [0, 6]];
const seventeen = [[10], [10], [10], [10], [10], [10], [10], [10], [10], [9], [8], [0, 7]];
const eighteen = [[10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [9], [0, 8]];
const nineteenPlus = [[10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [0, 9]];
const dieRollLookupTable = new Map([
    [-1, zeroMinus],
    [0, zero],
    [1, one],
    [2, two],
    [3, three],
    [4, four],
    [5, five],
    [6, six],
    [7, seven],
    [8, eight],
    [9, nine],
    [10, ten],
    [11, eleven],
    [12, twelve],
    [13, thirteen],
    [14, fourteen],
    [15, fifteen],
    [16, sixteen],
    [17, seventeen],
    [18, eighteen],
    [19, nineteenPlus]
]);
const airCombatResults = new Map([
    // Air Combat
    [AirNavalCombatType.CapvsUncoordinatedMission, [0, 1, 1, 1, 2, 3, 3, 3, 4, 4, 5, 5]],
    [AirNavalCombatType.CapvsCoordinatedMission, [0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5]],
    [AirNavalCombatType.AirSupremacyvsCap, [0, 1, 1, 1, 2, 3, 3, 3, 4, 4, 5, 5]],
    [AirNavalCombatType.UncoordinatedStrikevsCAP, [0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3]],
    [AirNavalCombatType.CoordinatedStrikevsCAP, [0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5]],
    // FLAK Combat
    [AirNavalCombatType.UnimprovedFlakvsAir, [0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3]],
    [AirNavalCombatType.ImprovedFlakvsAir, [0, 1, 1, 1, 1, 2, 2, 3, 3, 3, 4, 6]],
    // Strike Combat
    [AirNavalCombatType.FAirvsNaval, [0, 1, 1, 1, 2, 2, 3, 4, 4, 5, 6, 8]],
    [AirNavalCombatType.TAirvsNaval, [0, 0, 0, 1, 1, 2, 3, 4, 4, 4, 4, 6]],
    [AirNavalCombatType.BAirvsNaval, [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1]],
    [AirNavalCombatType.AirvsInstallation, [0, 1, 2, 2, 3, 4, 4, 5, 5, 6, 7, 9]],
    [AirNavalCombatType.AirvsGroundUnit, [0, exports.TroopQualityCheck, exports.TroopQualityCheck, exports.TroopQualityCheck, exports.TroopQualityCheck,
            exports.TroopQualityCheck, exports.TroopQualityCheck, exports.TroopQualityCheck, 1, 1, 1, 2]],
    // Strafe Combat
    [AirNavalCombatType.AirvsUnalertedAir, [0, 1, 2, 2, 3, 3, 3, 4, 4, 5, 5, 5]],
    // Naval Gunnery Combat
    [AirNavalCombatType.LongRangevsNaval, [0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3]],
    [AirNavalCombatType.MediumRangvsNaval, [0, 1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 4]],
    [AirNavalCombatType.ShortRangevsNaval, [0, 1, 1, 1, 2, 2, 3, 3, 3, 4, 5, 7]],
    [AirNavalCombatType.BombardmentvsInstallation, [0, 1, 2, 2, 3, 4, 4, 5, 5, 6, 7, 9]],
    [AirNavalCombatType.BombardmentvsGroundUnit, [0, exports.TroopQualityCheck, exports.TroopQualityCheck, exports.TroopQualityCheck, exports.TroopQualityCheck,
            exports.TroopQualityCheck, exports.TroopQualityCheck, exports.TroopQualityCheck, 1, 1, 1, 2]],
    // Torpedo Combat
    [AirNavalCombatType.SubOrNavalvsNaval, [0, 1, 1, 2, 2, 3, 3, 3, 4, 5, 6, 8]],
    // Anti-Submarin Combat
    [AirNavalCombatType.NavalvsSubmarine, [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
    // Strategic Bombing
    [AirNavalCombatType.NormalBombingFirst10, [0, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 5]],
    [AirNavalCombatType.FireBombing11, [0, 3, 5, 7, 9, 10, 11, 13, 14, 15, 16, 17]],
]);
// use die roll to get the correct row...that row (index) is the same as the number of hits in the Critical Hit table
const criticalHitTable = [
    [0, 5],
    [6, 7],
    [8],
    [9]
];
class AirNavalCombatResultsTable {
    static getHitsFor(modifiedStrength, dieRoll, combatType) {
        const index = AirNavalCombatResultsTable.getIndexFor(modifiedStrength, dieRoll);
        return AirNavalCombatResultsTable.determineAirCombatHits(combatType, index, dieRoll);
    }
    static getIndexFor(modifiedStrength, dieRoll, secondDieRoll) {
        AirNavalCombatResultsTable.criticalHit = false;
        // first get the row of the look up table for the strength given
        let key = modifiedStrength;
        if (modifiedStrength < 0) {
            key = -1;
        }
        if (modifiedStrength > 19) {
            key = 19;
        }
        const lookup = dieRollLookupTable.get(key);
        // then use the lookup to get the range of values possible, then use the die roll to index into this range
        // and get the final index to use in the hits table
        if (!lookup) {
            throw Error(`No result found in table for modified strength: ${modifiedStrength}`);
        }
        let indexIntoHits = 0;
        lookup.map((row, index) => {
            if (key === -1) {
                const dieRoll2 = secondDieRoll != undefined ? secondDieRoll : (0, Utility_1.getDieRoll)(); // pass in second die roll in tests
                if (dieRoll2 <= 4) {
                    indexIntoHits = 1;
                    if (dieRoll2 === 0) {
                        main_1.logger.debug(`second die roll = 0: AirNavalCombatResultsTable.criticalHit = true`);
                        AirNavalCombatResultsTable.criticalHit = true;
                    }
                    return;
                }
            }
            else if (dieRoll >= row[0] && dieRoll <= row[row.length - 1]) {
                indexIntoHits = index;
                if (dieRoll === 0) {
                    main_1.logger.debug(`die roll = 0: AirNavalCombatResultsTable.criticalHit = true`);
                    AirNavalCombatResultsTable.criticalHit = true;
                }
                return;
            }
        });
        main_1.logger.debug(`indexIntoHits = ${indexIntoHits}`);
        return indexIntoHits;
    }
    static getCriticalHits(dieRoll) {
        let indexIntoHits = 0;
        criticalHitTable.map((row, index) => {
            if (dieRoll >= row[0] && dieRoll <= row[row.length - 1]) {
                indexIntoHits = index;
                return;
            }
        });
        main_1.logger.debug(`critical hits indexIntoHits = ${indexIntoHits}`);
        return indexIntoHits;
    }
    static determineAirCombatHits(combatType, index, dieRoll) {
        const hitsArray = airCombatResults.get(combatType);
        if (!hitsArray) {
            throw Error('No row of results found for combat type ' + combatType);
        }
        let hits = hitsArray[index];
        if (hits === exports.TroopQualityCheck) {
            return { troopQualityCheck: true };
        }
        return { hits: hits, troopQualityCheck: false, criticalHit: AirNavalCombatResultsTable.criticalHit };
    }
}
exports.AirNavalCombatResultsTable = AirNavalCombatResultsTable;
AirNavalCombatResultsTable.criticalHit = false;
