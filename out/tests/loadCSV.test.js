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
const main_1 = require("../src/main");
const es1_1 = require("../src/scenarios/es1PearlHarbor/es1");
const AbstractUnit_1 = require("../src/units/AbstractUnit");
const Interfaces_1 = require("../src/units/Interfaces");
const main = new main_1.Main(new es1_1.ES1());
describe('CSV Load Service Pearl Harbor', () => {
    let rows;
    test('Load all rows for Engagement Scenario 1: Pearl Harbor', () => __awaiter(void 0, void 0, void 0, function* () {
        yield main.load();
        rows = main.Rows;
        expect(rows === null || rows === void 0 ? void 0 : rows.length).toBe(43);
    }));
    test('Initialise all units for Engagement Scenario 1: Pearl Harbor', () => __awaiter(void 0, void 0, void 0, function* () {
        if (!rows) {
            throw Error('No rows were loaded');
        }
        main.mapRowsToUnits(rows);
        const allUnits = main_1.Main.Mapper.Units;
        expect(allUnits.length).toBe(43);
    }));
    test('Japanese Aircraft Carrier Kaga has correct unit values', () => __awaiter(void 0, void 0, void 0, function* () {
        const kaga = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CV2');
        expect(kaga.Name).toBe('Kaga');
        expect(kaga.LaunchCapacity).toBe(5);
        expect(kaga.isCapitalShip()).toBe(true);
        expect(kaga.AAStrength).toBe(2);
        expect(kaga.LaunchCapacity).toBe(5);
        expect(kaga.HitCapacity).toBe(5);
        expect(kaga.Crippled).toBe(true);
        expect(kaga.ShortGunnery).toBe(-1);
        expect(kaga.MediumGunnery).toBe(-1);
        expect(kaga.LongGunnery).toBe(-1);
        expect(kaga.AirGroup).toBe('CAD2');
        expect(kaga.isCarrier()).toBe(true);
        expect(kaga.hasSpotterPlane()).toBe(false);
        expect(kaga.isNavalUnit()).toBe(true);
    }));
    test('Japanese Battleship Hiei has correct unit values', () => __awaiter(void 0, void 0, void 0, function* () {
        const hiei = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'BB8');
        expect(hiei.isCapitalShip()).toBe(true);
        expect(hiei.LaunchCapacity).toBe(NaN);
        expect(hiei.AAStrength).toBe(2);
        expect(hiei.HitCapacity).toBe(5);
        expect(hiei.Crippled).toBe(true);
        expect(hiei.ShortGunnery).toBe(6);
        expect(hiei.MediumGunnery).toBe(2);
        expect(hiei.LongGunnery).toBe(1);
        expect(hiei.AirGroup).toBe('');
        expect(hiei.BombardStrength).toBe(4);
        expect(hiei.isCarrier()).toBe(false);
        expect(hiei.hasSpotterPlane()).toBe(true);
        expect(hiei.ActivationStatus).toBe(Interfaces_1.ActivationStatus.Unactivated);
    }));
    test('US Battleship Arizona has correct unit values', () => __awaiter(void 0, void 0, void 0, function* () {
        const arizona = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'BB4');
        expect(arizona.isCapitalShip()).toBe(true);
        expect(arizona.LaunchCapacity).toBe(NaN);
        expect(arizona.AAStrength).toBe(3);
        expect(arizona.HitCapacity).toBe(6);
        expect(arizona.Crippled).toBe(true);
        expect(arizona.ShortGunnery).toBe(7);
        expect(arizona.MediumGunnery).toBe(3);
        expect(arizona.LongGunnery).toBe(1);
        expect(arizona.BombardStrength).toBe(6);
        expect(arizona.AirGroup).toBe('');
        expect(arizona.isCarrier()).toBe(false);
        expect(arizona.hasSpotterPlane()).toBe(true);
        expect(arizona.isNavalUnit()).toBe(true);
    }));
    test('US Destroyer Squadron Mahan has correct unit values', () => __awaiter(void 0, void 0, void 0, function* () {
        const mahan = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'DD5');
        expect(mahan.isCapitalShip()).toBe(false);
        expect(mahan.LaunchCapacity).toBe(NaN);
        expect(mahan.AAStrength).toBe(2);
        expect(mahan.HitCapacity).toBe(6);
        expect(mahan.Crippled).toBe(false);
        expect(mahan.ShortGunnery).toBe(2);
        expect(mahan.MediumGunnery).toBe(0);
        expect(mahan.LongGunnery).toBe(0.5);
        expect(mahan.BombardStrength).toBe(2);
        expect(mahan.isCarrier()).toBe(false);
        expect(mahan.hasSpotterPlane()).toBe(false);
        expect(mahan.isNavalUnit()).toBe(true);
    }));
    test('US 2nd MAW has correct unit values', () => __awaiter(void 0, void 0, void 0, function* () {
        const maw = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, '2nd MAW');
        expect(maw.Range).toBe(8);
        expect(maw.AAStrength).toBe(6);
        expect(maw.AntiNavalStrength).toBe(2);
        expect(maw.AntiGroundStrength).toBe(4);
        expect(maw.AircraftType).toBe(Interfaces_1.AircraftType.F);
        expect(maw.AircraftLevel).toBe(1);
        expect(maw.ReverseAA).toBe(6);
        expect(maw.Steps).toBe(4);
        expect(maw.isNavalUnit()).toBe(false);
    }));
    test('US 5th Bomber Group has correct unit values', () => __awaiter(void 0, void 0, void 0, function* () {
        const bg5 = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, '5th Bomber Group');
        expect(bg5.AAStrength).toBe(2);
        expect(bg5.Range).toBe(26);
        expect(bg5.AntiNavalStrength).toBe(1);
        expect(bg5.AntiGroundStrength).toBe(5);
        expect(bg5.AircraftType).toBe(Interfaces_1.AircraftType.B);
        expect(bg5.AircraftLevel).toBe(0);
        expect(bg5.ReverseAA).toBe(0);
        expect(bg5.Steps).toBe(1);
    }));
    test('2nd Patrol Wing has correct unit values', () => __awaiter(void 0, void 0, void 0, function* () {
        const pw2 = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, '2nd Patrol Wing');
        expect(pw2.AAStrength).toBe(NaN);
        expect(pw2.Range).toBe(16);
        expect(pw2.AircraftType).toBe(Interfaces_1.AircraftType.LRA);
        expect(pw2.Steps).toBe(1);
        expect(pw2.AircraftLevel).toBe(NaN);
        expect(pw2.ReverseAA).toBe(NaN);
        expect(pw2.AntiNavalStrength).toBe(NaN);
        expect(pw2.AntiGroundStrength).toBe(NaN);
        expect(pw2.isNavalUnit()).toBe(false);
    }));
    test('Japanese Aircraft Carrier Shokaku Carrier Air Group has correct unit values', () => __awaiter(void 0, void 0, void 0, function* () {
        const shokaku = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CV5');
        expect(shokaku.Name).toBe('Shokaku');
        const shokakuCAG = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, shokaku.AirGroup);
        expect(shokakuCAG.AAStrength).toBe(7);
        expect(shokakuCAG.Range).toBe(8);
        expect(shokakuCAG.AntiNavalStrength).toBe(8);
        expect(shokakuCAG.AntiGroundStrength).toBe(6);
        expect(shokakuCAG.AircraftType).toBe(Interfaces_1.AircraftType.F);
        expect(shokakuCAG.AircraftLevel).toBe(2);
        expect(shokakuCAG.ReverseAA).toBe(7);
        expect(shokakuCAG.Steps).toBe(6);
        expect(shokakuCAG.Hits).toBe(0);
    }));
    test('Japanese Aircraft Carrier Kaga Carrier Air Group has correct unit values', () => __awaiter(void 0, void 0, void 0, function* () {
        const kaga = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, 'CV2');
        expect(kaga.Name).toBe('Kaga');
        const kagaCAG = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Japan, kaga.AirGroup);
        expect(kagaCAG.AAStrength).toBe(7);
        expect(kagaCAG.Range).toBe(8);
        expect(kagaCAG.AntiNavalStrength).toBe(8);
        expect(kagaCAG.AntiGroundStrength).toBe(6);
        expect(kagaCAG.AircraftType).toBe(Interfaces_1.AircraftType.F);
        expect(kagaCAG.AircraftLevel).toBe(2);
        expect(kagaCAG.ReverseAA).toBe(7);
        expect(kagaCAG.Steps).toBe(5);
        expect(kagaCAG.Hits).toBe(1);
    }));
    test('2nd Patrol Wing has correct unit values', () => __awaiter(void 0, void 0, void 0, function* () {
        const bg5 = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, '2nd Patrol Wing');
        expect(bg5.AAStrength).toBe(NaN);
        expect(bg5.Range).toBe(16);
        expect(bg5.AircraftType).toBe(Interfaces_1.AircraftType.LRA);
        expect(bg5.Steps).toBe(1);
        expect(bg5.AircraftLevel).toBe(NaN);
        expect(bg5.ReverseAA).toBe(NaN);
        expect(bg5.AntiNavalStrength).toBe(NaN);
        expect(bg5.AntiGroundStrength).toBe(NaN);
        expect(bg5.isNavalUnit()).toBe(false);
    }));
    test('Pearl Harbor Base Unit has correct values', () => __awaiter(void 0, void 0, void 0, function* () {
        const ph = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'Pearl Harbor');
        expect(ph.AAStrength).toBe(3);
        expect(ph.Size).toBe(AbstractUnit_1.BaseSize.Large);
        expect(ph.Hex.HexNumber).toBe(2860);
    }));
    test('US Submarine Unit has correct values', () => __awaiter(void 0, void 0, void 0, function* () {
        const sub = main_1.Main.Mapper.getUnitById(Interfaces_1.Side.Allied, 'SubUnit');
        expect(sub.Steps).toBe(36);
    }));
});
