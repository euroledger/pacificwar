"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirStrikeTarget = void 0;
class AirStrikeTarget {
    constructor(options) {
        this.attacker = options.attacker;
        this.combatType = options.combatType;
        if (options.airTarget) {
            this.targetAirUnit = options.airTarget;
        }
        if (options.navalTargets) {
            this.navalTargets = options.navalTargets;
        }
    }
    get Attacker() {
        return this.attacker;
    }
    get AirTarget() {
        return this.targetAirUnit;
    }
    get NavalTargets() {
        return this.navalTargets;
    }
    get AirNavalCombatType() {
        return this.combatType;
    }
}
exports.AirStrikeTarget = AirStrikeTarget;
