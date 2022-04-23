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
const AirMissionSchematic_1 = require("../src/airmissions/AirMissionSchematic");
const AirStrikeTarget_1 = require("../src/airmissions/AirStrikeTarget");
const AirNavalCombatResultsTable_1 = require("../src/displays/AirNavalCombatResultsTable");
const Force_1 = require("../src/forces/Force");
const TaskForce_1 = require("../src/forces/TaskForce");
const main_1 = require("../src/main");
const es1_1 = require("../src/scenarios/es1PearlHarbor/es1");
const Hex_1 = require("../src/scenarios/Hex");
const AbstractUnit_1 = require("../src/units/AbstractUnit");
const BaseUnit_1 = require("../src/units/BaseUnit");
const Interfaces_1 = require("../src/units/Interfaces");
describe('Air Mission Schmatic', () => {
    let rows;
    const main = new main_1.Main(new es1_1.ES1());
    let airStrikeTargets;
    let airMission;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield main.load();
        rows = main.Rows;
        if (!rows) {
            throw Error('No rows were loaded');
        }
        main.mapRowsToUnits(rows);
        yield main.setUpGame();
    }));
    xtest('Air Mission Preliminary Procedure', () => __awaiter(void 0, void 0, void 0, function* () {
        const akagi = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CV1');
        const kaga = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CV2');
        const hiryu = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CV3');
        const soryu = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CV4');
        const shokaku = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CV5');
        const zuikaku = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CV6');
        const tone = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CA9');
        const kagero = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'DD9');
        const hiei = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'BB8');
        const kirishima = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'BB9');
        const taskForceOptions1 = {
            side: Interfaces_1.Side.Japan,
            taskForceId: 1,
            core: [akagi, kaga, hiryu],
            screen: [tone, kagero],
        };
        const taskForce1 = new TaskForce_1.TaskForce(taskForceOptions1);
        const carrierAirUnits1 = taskForce1.AirUnits;
        const taskForceOptions2 = {
            side: Interfaces_1.Side.Japan,
            taskForceId: 2,
            core: [soryu, shokaku, zuikaku],
            screen: [hiei, kirishima],
        };
        const taskForce2 = new TaskForce_1.TaskForce(taskForceOptions2);
        const carrierAirUnits2 = taskForce2.AirUnits;
        const missionAirUnits = carrierAirUnits1.concat(carrierAirUnits2);
        expect(missionAirUnits.length).toBe(6);
        const airMissionOptions = {
            airMissionType: AirMissionSchematic_1.AirMissionType.AirStrike,
            missionAirUnits: missionAirUnits,
            startHex: new Hex_1.Hex(3159),
            targetHex: new Hex_1.Hex(2860),
        };
        airMission = new es1_1.ES1AirMissionSchematic(airMissionOptions);
        const minLevel = airMission.getLowestStatusLevelOfMissionAirUnits();
        expect(minLevel).toBe(2);
        let coordinated = airMission.isCoordinated(4);
        expect(coordinated).toBe(true);
        coordinated = airMission.isCoordinated(7);
        expect(coordinated).toBe(false);
    }));
    test('Air Mission Designate Strike Targets in Force containing air and naval units', () => __awaiter(void 0, void 0, void 0, function* () {
        const options = {
            name: 'Oahu',
            type: AbstractUnit_1.Type.Base,
            side: Interfaces_1.Side.Allied,
            id: '',
            aaStrength: 3,
            launchCapacity: 18,
            size: AbstractUnit_1.BaseSize.Large,
            hexLocation: 2860
        };
        const oahuBase = new BaseUnit_1.BaseUnit(options);
        const california = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'BB10');
        const nevada = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'BB1');
        const tennessee = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'BB11');
        const maryland = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'BB8');
        const oklahoma = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'BB3');
        const westvirginia = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'BB9');
        const arizona = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'BB4');
        const pennsylvania = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'BB2');
        const pg18 = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, '18th Pursuit Group');
        const pg15 = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, '15th Pursuit Group');
        const bg11 = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, '11th Bomber Group');
        const bg5 = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, '5th Bomber Group');
        const pw1 = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, '1st Patrol Wing');
        const pw2 = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, '2nd Patrol Wing');
        const oahuHex = new Hex_1.Hex(2860);
        const forceOptions = {
            side: Interfaces_1.Side.Allied,
            forceId: 1,
            units: [oahuBase, california, nevada, tennessee, maryland, oklahoma, westvirginia, arizona, pennsylvania,
                pg15, pg18, bg5, bg11, pw1, pw2],
            location: oahuHex
        };
        const force = new Force_1.Force(forceOptions);
        oahuHex.addForceToHex(force);
        const cad1 = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CAD1');
        const cad2 = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CAD2');
        const cad3 = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CAD3');
        const cad4 = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CAD4');
        const cad5 = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CAD5');
        const cad6 = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CAD6');
        const missionAirUnits = [cad1, cad2, cad3, cad4, cad5, cad6];
        const airMissionOptions = {
            airMissionType: AirMissionSchematic_1.AirMissionType.AirStrike,
            missionAirUnits: missionAirUnits,
            startHex: new Hex_1.Hex(3159),
            targetHex: new Hex_1.Hex(2860),
        };
        airMission = new es1_1.ES1AirMissionSchematic(airMissionOptions);
        const battleshipsAtTarget = force.NavalUnits.filter(unit => unit.Id.startsWith('BB'));
        airStrikeTargets = airMission.allocateStrikeTargets(missionAirUnits, force.AirUnits, battleshipsAtTarget);
        expect(airStrikeTargets.length).toBe(6);
    }));
    test('Resolve Air Strike vs Naval Unit', () => __awaiter(void 0, void 0, void 0, function* () {
        airMission.strikeStrafeProcedure(airStrikeTargets);
        const california = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'BB10');
        const navalTargets = airStrikeTargets.filter((target) => target.AirNavalCombatType === AirNavalCombatResultsTable_1.AirNavalCombatType.FAirvsNaval);
        const ships = [california];
        const options = {
            attacker: navalTargets[0].Attacker,
            combatType: AirNavalCombatResultsTable_1.AirNavalCombatType.FAirvsNaval,
            navalTargets: ships
        };
        const airStrike = new AirStrikeTarget_1.AirStrikeTarget(options);
        airMission.resolveAirStrikesvsNaval(airStrike, 5);
        expect(california.Hits).toBe(4);
    }));
});
