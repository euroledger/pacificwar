"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightingConditionDisplay = exports.LightingCondition = void 0;
// class to set and provide the current lighting condition
const Utility_1 = require("../utils/Utility");
var LightingCondition;
(function (LightingCondition) {
    LightingCondition["Day_PM"] = "Day PM";
    LightingCondition["Dusk"] = "Dusk";
    LightingCondition["Night"] = "Night";
    LightingCondition["Day_AM"] = "Day AM";
    LightingCondition["Random"] = "Random";
})(LightingCondition = exports.LightingCondition || (exports.LightingCondition = {}));
const randomLightingTableIndexes = [[0, 1], [2], [3, 9]];
class LightingConditionDisplay {
    static incrementLightingDisplay(increment) {
        this.lightingConditionIndex =
            (this.lightingConditionIndex + increment) % Object.values(LightingCondition).length;
        console.log("New index = ", this.lightingConditionIndex);
        if (this.LightingCondition === LightingCondition.Random) {
            this.determineRandomLighting((0, Utility_1.getDieRoll)());
        }
    }
    static determineRandomLighting(dieRoll) {
        randomLightingTableIndexes.map((row, index) => {
            if (dieRoll >= row[0] && dieRoll <= row[row.length - 1]) {
                const key = this.randomLightingTable.get(index);
                if (!key) {
                    throw Error(`Die Roll ${dieRoll} out of range`);
                }
                LightingConditionDisplay.lightingConditionIndex = key;
                return;
            }
        });
    }
    static set LightingCondition(condition) {
        this.lightingConditionIndex = Object.values(LightingCondition).indexOf(condition);
    }
    static get LightingCondition() {
        return Object.values(LightingCondition)[this.lightingConditionIndex];
    }
}
exports.LightingConditionDisplay = LightingConditionDisplay;
LightingConditionDisplay.lightingConditionIndex = 0;
LightingConditionDisplay.randomLightingTable = new Map([
    [0, Object.keys(LightingCondition).indexOf(LightingCondition.Night)],
    [1, Object.keys(LightingCondition).indexOf(LightingCondition.Dusk)],
    [2, Object.keys(LightingCondition).indexOf(LightingCondition.Day_PM)],
]);
