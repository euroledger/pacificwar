"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.japaneseNavalSearchChartResults = exports.japaneseAirSearchChartResults = void 0;
const Interfaces_1 = require("../units/Interfaces");
const SearchCharts_1 = require("./SearchCharts");
const japaneseLRADayResults = new Map([
    [0, [[0, 5], [6, 7], [8]]],
    [1, [[0, 3], [4, 5], [6]]],
    [2, [[0, 2], [3, 4], [5]]],
    [3, [[0, 1], [2, 3], [4]]],
    [4, [[0], [1, 2], [3]]],
    [5, [[SearchCharts_1.DetectionLevel.undetected], [0, 1], [2]]],
    [6, [[SearchCharts_1.DetectionLevel.undetected], [0], [1]]],
    [7, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [0]]],
    [8, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [0]]],
]);
const japaneseLRANightResults = new Map([
    [0, [[0, 2], [3, 4], [5]]],
    [1, [[0], [1, 2], [3]]],
    [2, [[SearchCharts_1.DetectionLevel.undetected], [0, 1], [2]]],
    [3, [[SearchCharts_1.DetectionLevel.undetected], [0], [1]]],
    [4, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [0]]],
    [5, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [0]]],
    [6, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [0]]],
    [7, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [0]]],
    [8, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [0]]],
]);
const japaneseFTBDayResults = new Map([
    [0, [[0, 5], [6, 7], [8]]],
    [1, [[0, 2], [3, 4], [5]]],
    [2, [[0, 1], [2, 3], [4]]],
    [3, [[0], [1, 2], [3]]],
    [4, [[SearchCharts_1.DetectionLevel.undetected], [0, 1], [2]]],
    [5, [[SearchCharts_1.DetectionLevel.undetected], [0], [1]]],
    [6, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [0]]],
    [7, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [8, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
]);
const japaneseFTBNightResults = new Map([
    [0, [[0, 2], [3, 4], [5]]],
    [1, [[SearchCharts_1.DetectionLevel.undetected], [0], [1]]],
    [2, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [0]]],
    [3, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [4, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [5, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [6, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [7, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [8, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
]);
const japaneseSpotterDayResults = new Map([
    [0, [[0, 5], [6, 7], [8]]],
    [1, [[0, 1], [2, 3], [4]]],
    [2, [[0], [1, 2], [3]]],
    [3, [[SearchCharts_1.DetectionLevel.undetected], [0, 1], [2]]],
    [4, [[SearchCharts_1.DetectionLevel.undetected], [0], [1]]],
    [5, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [0]]],
    [6, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [0]]],
    [7, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [8, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
]);
const japaneseSpotterNightResults = new Map([
    [0, [[0, 2], [3, 4], [5]]],
    [1, [[SearchCharts_1.DetectionLevel.undetected], [0, 1], [2]]],
    [2, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [3, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [4, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [5, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [6, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [7, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [8, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
]);
const japaneseAirSearchDayResults = new Map([
    [0, [[0, 2], [3, 4], [5]]]
]);
const japaneseAirSearchNightResults = new Map([
    [0, [[0, 1], [2, 3], [4]]]
]);
const japaneseLRASearchTable = new Map([
    [SearchCharts_1.TimeOfDay.Day, japaneseLRADayResults],
    [SearchCharts_1.TimeOfDay.Night, japaneseLRANightResults],
]);
const japaneseFTBSearchTable = new Map([
    [SearchCharts_1.TimeOfDay.Day, japaneseFTBDayResults],
    [SearchCharts_1.TimeOfDay.Night, japaneseFTBNightResults],
]);
const japaneseSpotterSearchTable = new Map([
    [SearchCharts_1.TimeOfDay.Day, japaneseSpotterDayResults],
    [SearchCharts_1.TimeOfDay.Night, japaneseSpotterNightResults],
]);
exports.japaneseAirSearchChartResults = new Map([
    [SearchCharts_1.TimeOfDay.Day, japaneseAirSearchDayResults],
    [SearchCharts_1.TimeOfDay.Night, japaneseAirSearchNightResults],
]);
exports.japaneseNavalSearchChartResults = new Map([
    [Interfaces_1.AircraftType.LRA, japaneseLRASearchTable],
    [Interfaces_1.AircraftType.F, japaneseFTBSearchTable],
    [Interfaces_1.AircraftType.T, japaneseFTBSearchTable],
    [Interfaces_1.AircraftType.B, japaneseFTBSearchTable],
    [Interfaces_1.AircraftType.Spotter, japaneseSpotterSearchTable],
]);
