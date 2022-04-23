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
const AirNavalCombatResultsTable_1 = require("../src/displays/AirNavalCombatResultsTable");
const AlliedSearchTables_1 = require("../src/displays/AlliedSearchTables");
const JapaneseSearchTables_1 = require("../src/displays/JapaneseSearchTables");
const LightingConditionDisplay_1 = require("../src/displays/LightingConditionDisplay");
const SearchCharts_1 = require("../src/displays/SearchCharts");
const Interfaces_1 = require("../src/units/Interfaces");
describe('Pacific War Displays', () => {
    test('Lighting Condition Display', () => __awaiter(void 0, void 0, void 0, function* () {
        const lightingCondition = LightingConditionDisplay_1.LightingConditionDisplay.LightingCondition;
        expect(lightingCondition).toBe(LightingConditionDisplay_1.LightingCondition.Day_AM);
        LightingConditionDisplay_1.LightingConditionDisplay.incrementLightingDisplay(2);
        expect(LightingConditionDisplay_1.LightingConditionDisplay.LightingCondition).toBe(LightingConditionDisplay_1.LightingCondition.Day_PM);
        LightingConditionDisplay_1.LightingConditionDisplay.determineRandomLighting(0);
        expect(LightingConditionDisplay_1.LightingConditionDisplay.LightingCondition).toBe(LightingConditionDisplay_1.LightingCondition.Night);
        LightingConditionDisplay_1.LightingConditionDisplay.determineRandomLighting(2);
        expect(LightingConditionDisplay_1.LightingConditionDisplay.LightingCondition).toBe(LightingConditionDisplay_1.LightingCondition.Dusk);
    }));
    test('Air/Naval Combat Results Table', () => __awaiter(void 0, void 0, void 0, function* () {
        let modifiedStrength = 11;
        let dieRoll = 1;
        let index = AirNavalCombatResultsTable_1.AirNavalCombatResultsTable.getIndexFor(modifiedStrength, dieRoll);
        expect(index).toBe(11);
        // use this index to lookup number of hits for the correct type of air combat
        let result = AirNavalCombatResultsTable_1.AirNavalCombatResultsTable.determineAirCombatHits(AirNavalCombatResultsTable_1.AirNavalCombatType.AirSupremacyvsCap, index, dieRoll);
        expect(result.hits).toBe(5);
        modifiedStrength = 8;
        dieRoll = 2;
        result = AirNavalCombatResultsTable_1.AirNavalCombatResultsTable.getHitsFor(modifiedStrength, dieRoll, AirNavalCombatResultsTable_1.AirNavalCombatType.CapvsCoordinatedMission);
        expect(result.hits).toBe(3);
        modifiedStrength = 8;
        dieRoll = 9;
        result = AirNavalCombatResultsTable_1.AirNavalCombatResultsTable.getHitsFor(modifiedStrength, dieRoll, AirNavalCombatResultsTable_1.AirNavalCombatType.FAirvsNaval);
        expect(result.hits).toBe(0);
        modifiedStrength = 12;
        dieRoll = 3;
        result = AirNavalCombatResultsTable_1.AirNavalCombatResultsTable.getHitsFor(modifiedStrength, dieRoll, AirNavalCombatResultsTable_1.AirNavalCombatType.UncoordinatedStrikevsCAP);
        expect(result.hits).toBe(2);
        modifiedStrength = 8;
        dieRoll = 0;
        result = AirNavalCombatResultsTable_1.AirNavalCombatResultsTable.getHitsFor(modifiedStrength, dieRoll, AirNavalCombatResultsTable_1.AirNavalCombatType.TAirvsNaval);
        expect(result.hits).toBe(4);
        expect(result.criticalHit).toBe(true);
        modifiedStrength = 8;
        dieRoll = 3;
        result = AirNavalCombatResultsTable_1.AirNavalCombatResultsTable.getHitsFor(modifiedStrength, dieRoll, AirNavalCombatResultsTable_1.AirNavalCombatType.AirvsGroundUnit);
        expect(result.troopQualityCheck).toBe(true);
        expect(result.criticalHit).toBe(undefined);
        modifiedStrength = -1;
        dieRoll = 0;
        let secondDieRoll = 3;
        index = AirNavalCombatResultsTable_1.AirNavalCombatResultsTable.getIndexFor(modifiedStrength, dieRoll, secondDieRoll);
        expect(index).toBe(1);
        // use this index to lookup number of hits for the correct type of air combat
        result = AirNavalCombatResultsTable_1.AirNavalCombatResultsTable.determineAirCombatHits(AirNavalCombatResultsTable_1.AirNavalCombatType.ImprovedFlakvsAir, index, dieRoll);
        expect(result.hits).toBe(1);
        expect(result.criticalHit).toBe(false);
        modifiedStrength = -1;
        dieRoll = 0;
        secondDieRoll = 0;
        index = AirNavalCombatResultsTable_1.AirNavalCombatResultsTable.getIndexFor(modifiedStrength, dieRoll, secondDieRoll);
        expect(index).toBe(1);
        // use this index to lookup number of hits for the correct type of air combat
        result = AirNavalCombatResultsTable_1.AirNavalCombatResultsTable.determineAirCombatHits(AirNavalCombatResultsTable_1.AirNavalCombatType.ImprovedFlakvsAir, index, dieRoll);
        expect(result.criticalHit).toBe(true);
    }));
    test('Air/Naval Combat -> Critical Hits Table', () => __awaiter(void 0, void 0, void 0, function* () {
        let dieRoll = 0;
        let hits = AirNavalCombatResultsTable_1.AirNavalCombatResultsTable.getCriticalHits(dieRoll);
        expect(hits).toBe(0);
        dieRoll = 6;
        hits = AirNavalCombatResultsTable_1.AirNavalCombatResultsTable.getCriticalHits(dieRoll);
        expect(hits).toBe(1);
        dieRoll = 7;
        hits = AirNavalCombatResultsTable_1.AirNavalCombatResultsTable.getCriticalHits(dieRoll);
        expect(hits).toBe(1);
        dieRoll = 8;
        hits = AirNavalCombatResultsTable_1.AirNavalCombatResultsTable.getCriticalHits(dieRoll);
        expect(hits).toBe(2);
        dieRoll = 9;
        hits = AirNavalCombatResultsTable_1.AirNavalCombatResultsTable.getCriticalHits(dieRoll);
        expect(hits).toBe(3);
    }));
    test('Allied Search Chart - LRA air unit searching for Naval', () => __awaiter(void 0, void 0, void 0, function* () {
        let options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 0,
            dieRoll: 6,
            searchingAirUnitType: Interfaces_1.AircraftType.LRA,
            timeOfDay: SearchCharts_1.TimeOfDay.Day,
        };
        let result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedBlue);
        options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 5,
            dieRoll: 2,
            searchingAirUnitType: Interfaces_1.AircraftType.LRA,
            timeOfDay: SearchCharts_1.TimeOfDay.Day,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedRed);
        options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 5,
            dieRoll: 3,
            searchingAirUnitType: Interfaces_1.AircraftType.LRA,
            timeOfDay: SearchCharts_1.TimeOfDay.Day,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.undetected);
        options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 0,
            dieRoll: 5,
            searchingAirUnitType: Interfaces_1.AircraftType.LRA,
            timeOfDay: SearchCharts_1.TimeOfDay.Night,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedRed);
        options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 1,
            dieRoll: 2,
            searchingAirUnitType: Interfaces_1.AircraftType.LRA,
            timeOfDay: SearchCharts_1.TimeOfDay.Night,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedBlue);
        options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 2,
            dieRoll: 3,
            searchingAirUnitType: Interfaces_1.AircraftType.LRA,
            timeOfDay: SearchCharts_1.TimeOfDay.Night,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.undetected);
        options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 7,
            dieRoll: 0,
            searchingAirUnitType: Interfaces_1.AircraftType.LRA,
            timeOfDay: SearchCharts_1.TimeOfDay.Night,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedRed);
        options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 8,
            dieRoll: 1,
            searchingAirUnitType: Interfaces_1.AircraftType.LRA,
            timeOfDay: SearchCharts_1.TimeOfDay.Night,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.undetected);
        options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 0,
            dieRoll: 1,
            searchingAirUnitType: Interfaces_1.AircraftType.B,
            timeOfDay: SearchCharts_1.TimeOfDay.Day,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedGreen);
    }));
    test('Allied Search Chart - F,T or B air unit searching for Naval', () => __awaiter(void 0, void 0, void 0, function* () {
        let options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 0,
            dieRoll: 1,
            searchingAirUnitType: Interfaces_1.AircraftType.F,
            timeOfDay: SearchCharts_1.TimeOfDay.Day,
        };
        let result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedGreen);
        options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 0,
            dieRoll: 8,
            searchingAirUnitType: Interfaces_1.AircraftType.T,
            timeOfDay: SearchCharts_1.TimeOfDay.Day,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedRed);
        options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 0,
            dieRoll: 6,
            searchingAirUnitType: Interfaces_1.AircraftType.T,
            timeOfDay: SearchCharts_1.TimeOfDay.Day,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedBlue);
        options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 0,
            dieRoll: 0,
            searchingAirUnitType: Interfaces_1.AircraftType.T,
            timeOfDay: SearchCharts_1.TimeOfDay.Night,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedGreen);
        options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 1,
            dieRoll: 5,
            searchingAirUnitType: Interfaces_1.AircraftType.T,
            timeOfDay: SearchCharts_1.TimeOfDay.Night,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.undetected);
        options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 8,
            dieRoll: 0,
            searchingAirUnitType: Interfaces_1.AircraftType.F,
            timeOfDay: SearchCharts_1.TimeOfDay.Night,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.undetected);
    }));
    test('Allied Search Chart - Spotter air unit searching for Naval', () => __awaiter(void 0, void 0, void 0, function* () {
        let options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 0,
            dieRoll: 1,
            searchingAirUnitType: Interfaces_1.AircraftType.Spotter,
            timeOfDay: SearchCharts_1.TimeOfDay.Day,
        };
        let result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedGreen);
        options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 0,
            dieRoll: 8,
            searchingAirUnitType: Interfaces_1.AircraftType.Spotter,
            timeOfDay: SearchCharts_1.TimeOfDay.Day,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedRed);
        options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 4,
            dieRoll: 1,
            searchingAirUnitType: Interfaces_1.AircraftType.Spotter,
            timeOfDay: SearchCharts_1.TimeOfDay.Day,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.undetected);
        options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 3,
            dieRoll: 1,
            searchingAirUnitType: Interfaces_1.AircraftType.Spotter,
            timeOfDay: SearchCharts_1.TimeOfDay.Day,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedRed);
        options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 1,
            dieRoll: 5,
            searchingAirUnitType: Interfaces_1.AircraftType.Spotter,
            timeOfDay: SearchCharts_1.TimeOfDay.Night,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.undetected);
        options = {
            navalSearchTable: AlliedSearchTables_1.alliedSearchChartResults,
            range: 0,
            dieRoll: 3,
            searchingAirUnitType: Interfaces_1.AircraftType.Spotter,
            timeOfDay: SearchCharts_1.TimeOfDay.Night,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedBlue);
    }));
    test('Allied Search Chart -Search For Air', () => __awaiter(void 0, void 0, void 0, function* () {
        let options = {
            airSearchTable: AlliedSearchTables_1.alliedAirSearchChartResults,
            range: 0,
            dieRoll: 1,
            timeOfDay: SearchCharts_1.TimeOfDay.Day,
        };
        let result = SearchCharts_1.SearchChart.searchForAir(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedGreen);
        options = {
            airSearchTable: AlliedSearchTables_1.alliedAirSearchChartResults,
            range: 0,
            dieRoll: 6,
            timeOfDay: SearchCharts_1.TimeOfDay.Day,
        };
        result = SearchCharts_1.SearchChart.searchForAir(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedRed);
        options = {
            airSearchTable: AlliedSearchTables_1.alliedAirSearchChartResults,
            range: 0,
            dieRoll: 2,
            timeOfDay: SearchCharts_1.TimeOfDay.Night,
        };
        result = SearchCharts_1.SearchChart.searchForAir(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedBlue);
        options = {
            airSearchTable: AlliedSearchTables_1.alliedAirSearchChartResults,
            range: 0,
            dieRoll: 6,
            timeOfDay: SearchCharts_1.TimeOfDay.Night,
        };
        result = SearchCharts_1.SearchChart.searchForAir(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.undetected);
    }));
    test('Japanese Search Chart - F,T or B air unit searching for Naval', () => __awaiter(void 0, void 0, void 0, function* () {
        let options = {
            navalSearchTable: JapaneseSearchTables_1.japaneseNavalSearchChartResults,
            range: 3,
            dieRoll: 3,
            searchingAirUnitType: Interfaces_1.AircraftType.F,
            timeOfDay: SearchCharts_1.TimeOfDay.Day,
        };
        let result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedRed);
        options = {
            navalSearchTable: JapaneseSearchTables_1.japaneseNavalSearchChartResults,
            range: 1,
            dieRoll: 1,
            searchingAirUnitType: Interfaces_1.AircraftType.T,
            timeOfDay: SearchCharts_1.TimeOfDay.Night,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedRed);
        options = {
            navalSearchTable: JapaneseSearchTables_1.japaneseNavalSearchChartResults,
            range: 2,
            dieRoll: 0,
            searchingAirUnitType: Interfaces_1.AircraftType.T,
            timeOfDay: SearchCharts_1.TimeOfDay.Night,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedRed);
        options = {
            navalSearchTable: JapaneseSearchTables_1.japaneseNavalSearchChartResults,
            range: 3,
            dieRoll: 0,
            searchingAirUnitType: Interfaces_1.AircraftType.T,
            timeOfDay: SearchCharts_1.TimeOfDay.Night,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.undetected);
    }));
    test('Japanese Search Chart - Spotter air unit searching for Naval', () => __awaiter(void 0, void 0, void 0, function* () {
        let options = {
            navalSearchTable: JapaneseSearchTables_1.japaneseNavalSearchChartResults,
            range: 3,
            dieRoll: 2,
            searchingAirUnitType: Interfaces_1.AircraftType.Spotter,
            timeOfDay: SearchCharts_1.TimeOfDay.Day,
        };
        let result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedRed);
        options = {
            navalSearchTable: JapaneseSearchTables_1.japaneseNavalSearchChartResults,
            range: 4,
            dieRoll: 0,
            searchingAirUnitType: Interfaces_1.AircraftType.Spotter,
            timeOfDay: SearchCharts_1.TimeOfDay.Day,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedBlue);
        options = {
            navalSearchTable: JapaneseSearchTables_1.japaneseNavalSearchChartResults,
            range: 4,
            dieRoll: 1,
            searchingAirUnitType: Interfaces_1.AircraftType.Spotter,
            timeOfDay: SearchCharts_1.TimeOfDay.Day,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedRed);
        options = {
            navalSearchTable: JapaneseSearchTables_1.japaneseNavalSearchChartResults,
            range: 6,
            dieRoll: 0,
            searchingAirUnitType: Interfaces_1.AircraftType.Spotter,
            timeOfDay: SearchCharts_1.TimeOfDay.Day,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedRed);
        options = {
            navalSearchTable: JapaneseSearchTables_1.japaneseNavalSearchChartResults,
            range: 7,
            dieRoll: 5,
            searchingAirUnitType: Interfaces_1.AircraftType.Spotter,
            timeOfDay: SearchCharts_1.TimeOfDay.Day,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.undetected);
        options = {
            navalSearchTable: JapaneseSearchTables_1.japaneseNavalSearchChartResults,
            range: 1,
            dieRoll: 1,
            searchingAirUnitType: Interfaces_1.AircraftType.Spotter,
            timeOfDay: SearchCharts_1.TimeOfDay.Night,
        };
        result = SearchCharts_1.SearchChart.searchForNaval(options);
        expect(result).toBe(SearchCharts_1.DetectionLevel.detectedBlue);
    }));
});
