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
exports.ES1 = exports.ES1AirMissionSchematic = void 0;
const LightingConditionDisplay_1 = require("../../displays/LightingConditionDisplay");
const TaskForce_1 = require("../../forces/TaskForce");
const BattleCycle_1 = require("../../gamesequence/BattleCycle");
const main_1 = require("../../main");
const Scenario_1 = require("../Scenario");
const Utility_1 = require("../../utils/Utility");
const Interfaces_1 = require("../../units/Interfaces");
const Force_1 = require("../../forces/Force");
const Hex_1 = require("../Hex");
const GameStatus_1 = require("../GameStatus");
const AirMissionSchematic_1 = require("../../airmissions/AirMissionSchematic");
const AirStrikeTarget_1 = require("../../airmissions/AirStrikeTarget");
const AirNavalCombatResultsTable_1 = require("../../displays/AirNavalCombatResultsTable");
const es1Config_1 = require("./es1Config");
// If any of the air mission phases need to be done according to Scenario rules,
// then that is done in this sub-class
class ES1AirMissionSchematic extends AirMissionSchematic_1.AirMissionSchematic {
    constructor(options) {
        super(options);
    }
    moveMisionAirUnits() {
        return __awaiter(this, void 0, void 0, function* () {
            GameStatus_1.GameStatus.print('\n');
            GameStatus_1.GameStatus.print('\t\t\tJapanese Carrier Air Units move from 3159 to 2860 (Oahu)');
            // no detection in any hexes along route
        });
    }
    detectMisionAirUnits(hex) {
        return __awaiter(this, void 0, void 0, function* () {
            GameStatus_1.GameStatus.print('\n');
            GameStatus_1.GameStatus.print(`\t\t\tSearch for Air in hex ${hex.HexNumber}`);
            if (GameStatus_1.GameStatus.battleCycle === 1) {
                GameStatus_1.GameStatus.print(`\t\t\t\t => First Battle Cycle, no search conducted`);
            }
        });
    }
    isCoordinated(dieRoll) {
        const ret = super.isCoordinated(dieRoll);
        if (GameStatus_1.GameStatus.battleCycle === 1) {
            GameStatus_1.GameStatus.print('\t\t\t (redundant in Battle Cycle 1)');
        }
        return ret;
    }
    designateStrikeTargets() {
        return __awaiter(this, void 0, void 0, function* () {
            this.detectMisionAirUnits(this.targetHex);
            GameStatus_1.GameStatus.print('\n');
            GameStatus_1.GameStatus.print('\t\t\tDesignate Targets for Japanese Air Strike');
            GameStatus_1.GameStatus.print('\t\t\t-----------------------------------------');
            const force = this.targetHex.Force;
            const taskForces = this.targetHex.TaskForces;
            const numForces = force === undefined ? 0 : 1;
            const plural = numForces === 1 ? '' : 's';
            GameStatus_1.GameStatus.print(`\t\t\tTarget Hex contains ${numForces} force${plural}, and ${taskForces.length} task forces`);
            GameStatus_1.GameStatus.print(`\t\t\t\t => Target is Force`);
            const battleshipsAtTarget = force.NavalUnits.filter((unit) => unit.Id.startsWith('BB'));
            const airStrikeTargets = this.allocateStrikeTargets(this.missionAirUnits, force.AirUnits, battleshipsAtTarget);
            return airStrikeTargets;
            // for each air strike attacker-target pair conduct one attack using the correct row on the Air-Naval Combat Table
        });
    }
    // Air Unit targeting for first battle cycle
    // 1. This algorithm targets between 1 and 3 air units and 6 battleships per air unit (by default) (see config)
    // 2. Each Japanese air unit attacking US air units will target the one US air unit not already targeted containing the
    // most steps
    // 3. Each Japanese air unit attacking US naval units will target the same group of 6 battleships
    // 4. To prevent hits bunching on one or two ships the order of targeting amongst the six is reversed for each air unit
    // 5. We do not need to preallocate air unit targets but since the hits will be spread amongst multiple air units
    // I have done so anyway (makes little difference)
    allocateStrikeTargets(missionAirUnits, airUnitsAtTarget, battleshipsAtTarget) {
        // allocate 1, 2 or 3 units to attack US air
        // 3, 4 or 5 remaining steps attack BBs
        const numAirUnitsAttackingAir = (0, Utility_1.random)(es1Config_1.minNumberOfAirUnitTargets, es1Config_1.maxNumberOfAirUnitTargets);
        // sort air targets into order of priority based on number of steps
        airUnitsAtTarget.sort((a, b) => b.Steps - a.Steps);
        // get the first n units to be the list of units to be attacked
        const targetAirUnits = airUnitsAtTarget.slice(0, numAirUnitsAttackingAir);
        const airStrikeTargets = new Array();
        // allocate Japanese air units to attack these n air units
        const airUnitsAttackingAir = missionAirUnits
            .sort(() => Math.random() - Math.random())
            .slice(0, numAirUnitsAttackingAir);
        let index = 0;
        for (const unit of airUnitsAttackingAir) {
            airStrikeTargets.push(new AirStrikeTarget_1.AirStrikeTarget({
                attacker: unit,
                combatType: AirNavalCombatResultsTable_1.AirNavalCombatType.AirvsUnalertedAir,
                airTarget: targetAirUnits[index++],
            }));
        }
        const airUnitsAttackingNaval = missionAirUnits.filter((el) => !airUnitsAttackingAir.includes(el));
        // Select 6 battleships to target then allocate attacking units amongst these
        // as per victory conditions (need to get 4 hits on 6 battleships)
        let targetBattleships = battleshipsAtTarget
            .sort(() => Math.random() - Math.random())
            .slice(0, es1Config_1.numBattleshipsPerTargetGroup);
        // each air unit will target numBattleshipsPerTargetGroup ships
        // next air unit will target those same 6 ships but in reverse to spread hits evenly
        GameStatus_1.GameStatus.print('\n');
        GameStatus_1.GameStatus.print(`\t\t\t\t => ${airUnitsAttackingNaval.length} air units attacking 6 battleships each`);
        GameStatus_1.GameStatus.print(`\t\t\t\t => ${airUnitsAttackingAir.length} air units attacking unalerted air units`);
        const reverseArray = [...targetBattleships].reverse();
        let odd = true;
        for (const unit of airUnitsAttackingNaval) {
            airStrikeTargets.push(new AirStrikeTarget_1.AirStrikeTarget({
                attacker: unit,
                combatType: AirNavalCombatResultsTable_1.AirNavalCombatType.FAirvsNaval,
                navalTargets: odd ? targetBattleships : reverseArray,
            }));
            odd = !odd;
        }
        return airStrikeTargets;
    }
    strikeStrafeProcedure(airStrikeTargets) {
        GameStatus_1.GameStatus.print('\n');
        GameStatus_1.GameStatus.print(`\t\t\tResolve Air Strikes`);
        GameStatus_1.GameStatus.print('\t\t\t-------------------');
        GameStatus_1.GameStatus.print('\n');
        // we do naval attacks first so that the -5 modifier will count, which maximises the chances
        // of a critical hit (critical hits do not apply to air units)
        const airUnitTargets = airStrikeTargets.filter((target) => target.AirNavalCombatType === AirNavalCombatResultsTable_1.AirNavalCombatType.AirvsUnalertedAir);
        const navalUnitTargets = airStrikeTargets.filter((target) => target.AirNavalCombatType === AirNavalCombatResultsTable_1.AirNavalCombatType.FAirvsNaval);
        // 1. Resolve all air attacks against naval units
        this.firstAttack = GameStatus_1.GameStatus.battleCycle === 1;
        for (const airStrike of navalUnitTargets) {
            if (airStrike.AirNavalCombatType === AirNavalCombatResultsTable_1.AirNavalCombatType.FAirvsNaval) {
                let unmodifiedDieRoll = (0, Utility_1.getDieRoll)();
                this.resolveAirStrikesvsNaval(airStrike, unmodifiedDieRoll);
            }
        }
        // Resolve all air attacks against [unalerted] air units
        for (const airStrike of airUnitTargets) {
            let dieRoll = (0, Utility_1.getDieRoll)();
            GameStatus_1.GameStatus.print(`\t\t\tAttacker is ${airStrike.Attacker.print()} - attack vs. ${airStrike.AirTarget.print()} using row ${airStrike.AirNavalCombatType}`);
            GameStatus_1.GameStatus.print(`\t\t\t\t\t=> Die Roll is ${dieRoll}`);
        }
    }
    resolveAirStrikesvsNaval(airStrike, unmodifiedDieRoll) {
        GameStatus_1.GameStatus.print(`\t\t\tAir Unit ${airStrike.Attacker.print()} attacking (in order of priority):`);
        let priority = 1;
        for (const ship of airStrike.NavalTargets) {
            GameStatus_1.GameStatus.print(`\t\t\t\t${priority++} ${ship.print()}`);
        }
        let modifiedDieRoll = unmodifiedDieRoll;
        let modifierStr = '';
        // Herman ruling: first attack DRM applies to attacks against air units as well as naval units
        if (this.firstAttack) {
            modifiedDieRoll = Math.max(0, unmodifiedDieRoll - 5);
            modifierStr = ` (-5 for first attack) = ${modifiedDieRoll}`;
        }
        else {
            modifiedDieRoll = unmodifiedDieRoll;
        }
        this.firstAttack = false;
        GameStatus_1.GameStatus.print(`\t\t\t\t\t=> using row ${airStrike.AirNavalCombatType}`);
        GameStatus_1.GameStatus.print(`\t\t\t\t\t=> Die Roll is ${unmodifiedDieRoll}${modifierStr}`);
        const attackerModifiedStrength = airStrike.Attacker.AntiNavalStrength - airStrike.Attacker.Hits;
        GameStatus_1.GameStatus.print(`\t\t\t\t\t=> Attacker Anti-Naval Strength is ${attackerModifiedStrength}`);
        let result = AirNavalCombatResultsTable_1.AirNavalCombatResultsTable.getHitsFor(attackerModifiedStrength, modifiedDieRoll, AirNavalCombatResultsTable_1.AirNavalCombatType.FAirvsNaval);
        if (result.hits === undefined) {
            throw Error(`No result from Air-Naval Combat Results Table`);
        }
        GameStatus_1.GameStatus.print(`\t\t\t\t\t=> Number of Hits = ${result.hits}`);
        let hits = result.hits;
        if (modifiedDieRoll == 0) {
            let secondDieRoll = (0, Utility_1.getDieRoll)();
            const criticalHitsDieRoll = AirNavalCombatResultsTable_1.AirNavalCombatResultsTable.getCriticalHits(secondDieRoll);
            hits += criticalHitsDieRoll;
            GameStatus_1.GameStatus.print(`\t\t\t\t\t=> Critical Hit Die Roll = ${secondDieRoll}, Number Extra Hits = ${criticalHitsDieRoll}`);
            GameStatus_1.GameStatus.print(`\t\t\t\t\t=> Total Number of Hits = ${hits}`);
        }
        if (GameStatus_1.GameStatus.battleCycle === 1) {
            hits *= 2;
            GameStatus_1.GameStatus.print(`\t\t\t\t\t=> First Battle Cycle hits doubled, Final Num Hits = ${hits}`);
        }
        GameStatus_1.GameStatus.print(`\n`);
    }
    distributeHits(group, hits) {
    }
}
exports.ES1AirMissionSchematic = ES1AirMissionSchematic;
// override default battle cycle rules with scenario specific rules here
class ES1BattleCyle extends BattleCycle_1.DefaultBattleCycle {
    constructor(scenario) {
        super();
        this.scenario = scenario;
    }
    lightingPhase() {
        return __awaiter(this, void 0, void 0, function* () {
            GameStatus_1.GameStatus.print('\t\t\tLIGHTING PHASE');
            GameStatus_1.GameStatus.print('\t\t\t=========================');
            GameStatus_1.GameStatus.print('\t\t\t\t=> Set Lighting To DAY AM');
            GameStatus_1.GameStatus.print('-------------------------------------------------------------------------------------------------');
            LightingConditionDisplay_1.LightingConditionDisplay.LightingCondition = LightingConditionDisplay_1.LightingCondition.Day_AM;
            yield GameStatus_1.GameStatus.pause(2500);
        });
    }
    advantageDeterminationPhase() {
        return __awaiter(this, void 0, void 0, function* () {
            GameStatus_1.GameStatus.print('\t\t\tADVANTAGE DETERMINATION PHASE');
            GameStatus_1.GameStatus.print('\t\t\t===================================');
            GameStatus_1.GameStatus.print('\t\t\t\t=> Set Advantage To Japan');
            GameStatus_1.GameStatus.print('-------------------------------------------------------------------------------------------------');
            GameStatus_1.GameStatus.advantage = Interfaces_1.Side.Japan;
            yield GameStatus_1.GameStatus.pause(2500);
        });
    }
    advantageMovementPhase() {
        return __awaiter(this, void 0, void 0, function* () {
            GameStatus_1.GameStatus.print('\t\t\tADVANTAGE MOVEMENT PHASE');
            GameStatus_1.GameStatus.print('\t\t\t===================================');
            GameStatus_1.GameStatus.print('\t\t\t\t=> No movement. Japanese TFs remain at hex 3519');
            GameStatus_1.GameStatus.print('-------------------------------------------------------------------------------------------------');
            GameStatus_1.GameStatus.advantage = Interfaces_1.Side.Japan;
            // note second battle cycle -> US can do a search here even if Japanese TFs do not move
            yield GameStatus_1.GameStatus.pause(2500);
        });
    }
    advantageAirMissionPhase() {
        return __awaiter(this, void 0, void 0, function* () {
            GameStatus_1.GameStatus.print('\t\t\tADVANTAGE AIR MISSION PHASE');
            GameStatus_1.GameStatus.print('\t\t\t===================================');
            // decide target hex, origin hex, mission type and air units
            let missionAirUnits;
            // get all air units from the two Japanese task forces
            missionAirUnits = this.scenario.TaskForces[0].AirUnits;
            missionAirUnits = missionAirUnits.concat(this.scenario.TaskForces[1].AirUnits);
            GameStatus_1.GameStatus.print('\t\t\t\tMission Air Units');
            GameStatus_1.GameStatus.print('\t\t\t\t-----------------');
            for (const airUnit of missionAirUnits) {
                GameStatus_1.GameStatus.print('\t\t\t\t', airUnit.print());
            }
            yield GameStatus_1.GameStatus.pause(2500);
            const targetHex = this.scenario.Force.Location;
            const airMissionOptions = {
                airMissionType: AirMissionSchematic_1.AirMissionType.AirStrike,
                missionAirUnits: missionAirUnits,
                startHex: new Hex_1.Hex(3159),
                targetHex: targetHex,
            };
            const airMission = new ES1AirMissionSchematic(airMissionOptions);
            yield airMission.doAirMission();
        });
    }
}
class ES1 extends Scenario_1.PacificWarScenario {
    constructor() {
        super({
            name: 'Engagement Scenario 1 Pearl Harbor',
            number: 1,
            csvFile: 'es1.csv',
            numberBattleCycles: 2,
        });
        this.taskForces = new Array();
        this.oahuHex = new Hex_1.Hex(2860);
        this.japaneseTFHex = new Hex_1.Hex(3159);
        this.battleCycle = new ES1BattleCyle(this);
        // in this scenario, it is hard-wired to be DAY AM in first battle cycle, DAY_PM second battle cycle
        this.battleCycle.LightingCondition = LightingConditionDisplay_1.LightingCondition.Day_AM;
    }
    createAlliedForce(alliedPlayer) {
        return __awaiter(this, void 0, void 0, function* () {
            // just add all units to the force including the Base marker and set the hex (location)
            this.oahuHex = new Hex_1.Hex(2860);
            const forceOptions = {
                side: Interfaces_1.Side.Allied,
                forceId: 1,
                units: [],
                location: this.oahuHex,
            };
            this.force = new Force_1.Force(forceOptions);
            this.oahuHex.addForceToHex(this.force);
            for (const unit of alliedPlayer.Units) {
                // add all units to the same force
                this.force.addUnitToForce(unit);
            }
            GameStatus_1.GameStatus.print('\n');
            this.force.print();
            GameStatus_1.GameStatus.print('\n');
            yield GameStatus_1.GameStatus.pause(2500);
        });
    }
    get TaskForces() {
        return this.taskForces;
    }
    get Force() {
        return this.force;
    }
    createJapaneseTaskForces(japanesePlayer) {
        return __awaiter(this, void 0, void 0, function* () {
            // creation of two Japanese Task Forces is random subject to the TF rules
            const taskForceOptions = {
                side: Interfaces_1.Side.Japan,
                taskForceId: 1,
                core: [],
                screen: [],
            };
            const tf1 = new TaskForce_1.TaskForce(taskForceOptions);
            this.japaneseTFHex.addTaskForceToHex(tf1);
            this.taskForces.push(tf1);
            taskForceOptions.taskForceId = 2;
            const tf2 = new TaskForce_1.TaskForce(taskForceOptions);
            this.japaneseTFHex.addTaskForceToHex(tf2);
            this.taskForces.push(tf2);
            // get a random number (0 or 1) for the task force
            for (const unit of japanesePlayer.Units) {
                unit.ActivationStatus = Interfaces_1.ActivationStatus.Activated;
                // if the ship is a CV add to core else add to screen
                const tf = (0, Utility_1.random)(0, 1);
                if (unit.Id.startsWith('CV')) {
                    main_1.logger.debug(`Adding ${unit.Id}-${unit.Name} to task force ${tf + 1} (CORE)`);
                    this.taskForces[tf].addUnitToCore(unit);
                }
                else if (unit.isNavalUnit()) {
                    main_1.logger.debug(`Adding ${unit.Id}-${unit.Name} to task force ${tf + 1} (SCREEN)`);
                    try {
                        this.taskForces[tf].addUnitToScreen(unit);
                    }
                    catch (Error) {
                        // tried to add to screen of one task force - add to other Instead
                        main_1.logger.debug(`Error adding ${unit.Id} to task force ${tf + 1} -> add to task force ${((tf + 1) % 2) + 1} instead`);
                        try {
                            this.taskForces[(tf + 1) % 2].addUnitToScreen(unit);
                        }
                        catch (Error) {
                            // possible that we try to add capital ship to tf with 6 - add to core
                            if (unit.Id.startsWith('BB')) {
                                try {
                                    this.taskForces[tf].addUnitToCore(unit);
                                }
                                catch (Error) {
                                    // possible that we try to add capital ship to tf with 6 - add to core of other task force
                                    this.taskForces[(tf + 1) % 2].addUnitToCore(unit);
                                }
                            }
                            else {
                                main_1.logger.error(`Cannot add ${unit.Id} to task force ${tf + 1}`);
                            }
                        }
                    }
                }
            }
            GameStatus_1.GameStatus.print('\n');
            for (const tf of this.taskForces) {
                tf.print();
                GameStatus_1.GameStatus.print('\n');
            }
            yield GameStatus_1.GameStatus.pause(2500);
        });
    }
    setUpScenario(japanesePlayer, alliedPlayer) {
        return __awaiter(this, void 0, void 0, function* () {
            GameStatus_1.GameStatus.print('Scenario Set Up -> Create Japanese Task Forces');
            yield this.createJapaneseTaskForces(japanesePlayer);
            GameStatus_1.GameStatus.print('Scenario Set Up -> Create Allied Force');
            yield this.createAlliedForce(alliedPlayer);
            yield GameStatus_1.GameStatus.pause(2500);
        });
    }
    get BattleCycle() {
        return this.battleCycle;
    }
}
exports.ES1 = ES1;
