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
const Force_1 = require("../src/forces/Force");
const TaskForce_1 = require("../src/forces/TaskForce");
const main_1 = require("../src/main");
const es1_1 = require("../src/scenarios/es1PearlHarbor/es1");
const Hex_1 = require("../src/scenarios/Hex");
const AbstractUnit_1 = require("../src/units/AbstractUnit");
const BaseUnit_1 = require("../src/units/BaseUnit");
const Interfaces_1 = require("../src/units/Interfaces");
const main = new main_1.Main(new es1_1.ES1());
describe('Create Task Forces & Force', () => {
    let rows;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield main.load();
        rows = main.Rows;
        if (!rows) {
            throw Error('No rows were loaded');
        }
        main.mapRowsToUnits(rows);
        yield main.setUpGame();
    }));
    test('Create a Japanese Task Force', () => __awaiter(void 0, void 0, void 0, function* () {
        const shokaku = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CV5');
        const kaga = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CV2');
        const tone = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CA9');
        const kagero = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'DD9');
        const hiei = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'BB8');
        const kirishima = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'BB9');
        const taskForceOptions = {
            side: Interfaces_1.Side.Japan,
            taskForceId: 1,
            core: [shokaku, kaga, hiei],
            screen: [kirishima, tone, kagero],
        };
        const taskForce = new TaskForce_1.TaskForce(taskForceOptions);
        expect(taskForce.Core.length).toEqual(3);
        expect(taskForce.Screen.length).toEqual(3);
        expect(kirishima.ActivationStatus).toBe(Interfaces_1.ActivationStatus.Activated);
    }));
    test('Create an Allied Task Force', () => __awaiter(void 0, void 0, void 0, function* () {
        // create an Allied Task Force with 2 x BB in core; 1 x CA and 1 x DD in screen
        const mahan = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'DD5');
        const nevada = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'BB1');
        const tennessee = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'BB11');
        const neworleans = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'CA6');
        const taskForceOptions = {
            side: Interfaces_1.Side.Allied,
            taskForceId: 1,
            core: [tennessee, nevada],
            screen: [mahan, neworleans],
        };
        const taskForce = new TaskForce_1.TaskForce(taskForceOptions);
        expect(taskForce.Core.length).toEqual(2);
        expect(taskForce.Screen.length).toEqual(2);
        expect(nevada.ActivationStatus).toBe(Interfaces_1.ActivationStatus.Unactivated);
    }));
    test('Get the carrier air units from a task force', () => __awaiter(void 0, void 0, void 0, function* () {
        const shokaku = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CV5');
        const kaga = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CV2');
        const tone = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CA9');
        const kagero = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'DD9');
        const hiei = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'BB8');
        const kirishima = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'BB9');
        const taskForceOptions = {
            side: Interfaces_1.Side.Japan,
            taskForceId: 1,
            core: [shokaku, kaga, hiei],
            screen: [kirishima, tone, kagero],
        };
        const taskForce = new TaskForce_1.TaskForce(taskForceOptions);
        const carrierAirUnits = taskForce.AirUnits;
        expect(carrierAirUnits.length).toBe(2);
        expect(carrierAirUnits[0].Id).toBe('CAD5');
        expect(carrierAirUnits[1].Id).toBe('CAD2');
    }));
    test('Try to create an illegal Task Force', () => __awaiter(void 0, void 0, void 0, function* () {
        // try to create a task force with:
        // a) a CV in the screen
        // b) a CA in the core
        // c) unloaded DD in the core
        // e) too many units in core (< num in screen)
        // f) too many capital ships (>6) in TF
        // g) too many non-capital ships (>4) in TF
        // h) add a ship to the TF that is already there
        const shokaku = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CV5');
        const kaga = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CV2');
        const tone = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CA9');
        const kagero = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'DD9');
        const hiei = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'BB8');
        const kirishima = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'BB9');
        const akagi = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CV1');
        const hiryu = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CV3');
        const zuikaku = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CV6');
        const taskForceOptions = {
            side: Interfaces_1.Side.Japan,
            taskForceId: 1,
            core: [shokaku, hiei],
            screen: [kaga],
        };
        expect(() => {
            new TaskForce_1.TaskForce(taskForceOptions);
        }).toThrowError('Unit CV2 cannot be in screen');
        const taskForceOptions2 = {
            side: Interfaces_1.Side.Japan,
            taskForceId: 1,
            core: [shokaku, tone],
            screen: [kaga],
        };
        expect(() => {
            new TaskForce_1.TaskForce(taskForceOptions2);
        }).toThrowError('Unit CA9 cannot be in core');
        const taskForceOptions3 = {
            side: Interfaces_1.Side.Japan,
            taskForceId: 1,
            core: [shokaku, kagero],
            screen: [kaga],
        };
        expect(() => {
            new TaskForce_1.TaskForce(taskForceOptions3);
        }).toThrowError('Unit DD9 cannot be in core');
        const taskForceOptions5 = {
            side: Interfaces_1.Side.Japan,
            taskForceId: 1,
            core: [hiei],
            screen: [kagero, tone],
        };
        expect(() => {
            new TaskForce_1.TaskForce(taskForceOptions5);
        }).toThrowError('Cannot add unit CA9 to screen - would make screen size bigger than core size');
        const taskForceOptions6 = {
            side: Interfaces_1.Side.Japan,
            taskForceId: 1,
            core: [hiryu, akagi, kaga, shokaku, zuikaku],
            screen: [kirishima, hiei],
        };
        expect(() => {
            new TaskForce_1.TaskForce(taskForceOptions6);
        }).toThrowError('Cannot add unit BB8 to TF: capital ship limit (6) reached');
        const nevada = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'BB1');
        const tennessee = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'BB11');
        const california = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'BB10');
        const maryland = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'BB8');
        const oklahoma = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'BB3');
        const brooklyn1 = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'CL3');
        const brooklyn2 = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'CL4');
        const omaha = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'CL2');
        const mahan = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'DD5');
        const farragut = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'DD3');
        const taskForceOptions7 = {
            side: Interfaces_1.Side.Allied,
            taskForceId: 1,
            core: [nevada, tennessee, california, maryland, oklahoma],
            screen: [brooklyn1, brooklyn2, omaha, mahan, farragut],
        };
        expect(() => {
            new TaskForce_1.TaskForce(taskForceOptions7);
        }).toThrowError('Cannot add unit DD3 to TF: Non-capital ship limit (4) reached');
        const taskForceOptions8 = {
            side: Interfaces_1.Side.Allied,
            taskForceId: 1,
            core: [nevada, tennessee, california, maryland, oklahoma],
            screen: [brooklyn1, brooklyn2, omaha, mahan, california],
        };
        expect(() => {
            new TaskForce_1.TaskForce(taskForceOptions8);
        }).toThrowError('Unit BB10 already exists in the task force');
        const taskForceOptions9 = {
            side: Interfaces_1.Side.Allied,
            taskForceId: 1,
            core: [nevada, tennessee, maryland, oklahoma],
            screen: [brooklyn1, brooklyn2, omaha, mahan],
        };
        const taskForce = new TaskForce_1.TaskForce(taskForceOptions9);
        expect(() => {
            taskForce.removeUnitFromCoreById(maryland.Id);
        }).toThrowError('Cannot remove Unit BB8 as core would contain less units than screen');
        taskForce.removeUnitFromScreenById(brooklyn2.Id);
        expect(taskForce.Screen.length).toBe(3);
    }));
    test('Create an Allied Force', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create an Allied Force with all Scenario 1 units in a large base in Oahu
        const options = {
            name: 'Oahu',
            type: AbstractUnit_1.Type.Base,
            side: Interfaces_1.Side.Allied,
            id: '',
            aaStrength: 3,
            launchCapacity: 18,
            size: BaseUnit_1.BaseSize.Large,
            hexLocation: 2860
        };
        const oahuBase = new BaseUnit_1.BaseUnit(options);
        const mahan = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'DD5');
        const nevada = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'BB1');
        const tennessee = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'BB11');
        const neworleans = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'CA6');
        const oahuHex = new Hex_1.Hex(2860);
        const forceOptions = {
            side: Interfaces_1.Side.Allied,
            forceId: 1,
            units: [oahuBase, mahan, nevada, tennessee, neworleans],
            location: oahuHex
        };
        const force = new Force_1.Force(forceOptions);
        expect(force.getActivatedUnits.length).toBe(0);
        expect(force.getDeactivatedUnits.length).toBe(0);
        expect(force.getUnactivatedUnits.length).toBe(0);
        expect(() => {
            force.removeUnitFromForceById('BB8');
        }).toThrowError('Unit BB8 not found in Force 1');
        force.removeUnitFromForceById(mahan.Id);
        expect(force.Units.length).toBe(4);
    }));
});
