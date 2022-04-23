"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alliedSearchChartResults = exports.alliedAirSearchChartResults = void 0;
const Interfaces_1 = require("../units/Interfaces");
const SearchCharts_1 = require("./SearchCharts");
const alliedLRADayResults = new Map([
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
const alliedLRANightResults = new Map([
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
const alliedFTBDayResults = new Map([
    [0, [[0, 5], [6, 7], [8]]],
    [1, [[0, 2], [3, 4], [5]]],
    [2, [[0, 1], [2, 3], [4]]],
    [3, [[0], [1, 2], [3]]],
    [4, [[SearchCharts_1.DetectionLevel.undetected], [0, 1], [2]]],
    [5, [[SearchCharts_1.DetectionLevel.undetected], [0], [1]]],
    [6, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [7, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [8, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
]);
const alliedFTBNightResults = new Map([
    [0, [[0, 2], [3, 4], [5]]],
    [1, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [2, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [3, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [4, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [5, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [6, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [7, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [8, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
]);
const alliedSpotterDayResults = new Map([
    [0, [[0, 5], [6, 7], [8]]],
    [1, [[0], [1, 2], [3]]],
    [2, [[SearchCharts_1.DetectionLevel.undetected], [0, 1], [2]]],
    [3, [[SearchCharts_1.DetectionLevel.undetected], [0], [1]]],
    [4, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [0]]],
    [5, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [6, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [7, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [8, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
]);
const alliedSpotterNightResults = new Map([
    [0, [[0, 2], [3, 4], [5]]],
    [1, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [2, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [3, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [4, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [5, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [6, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [7, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
    [8, [[SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected], [SearchCharts_1.DetectionLevel.undetected]]],
]);
const alliedAirSearchDayResults = new Map([
    [0, [[0, 3], [4, 5], [6]]]
]);
const alliedAirSearchNightResults = new Map([
    [0, [[0, 1], [2, 3], [4]]]
]);
const alliedLRASearchTable = new Map([
    [SearchCharts_1.TimeOfDay.Day, alliedLRADayResults],
    [SearchCharts_1.TimeOfDay.Night, alliedLRANightResults],
]);
const alliedFTBSearchTable = new Map([
    [SearchCharts_1.TimeOfDay.Day, alliedFTBDayResults],
    [SearchCharts_1.TimeOfDay.Night, alliedFTBNightResults],
]);
const alliedSpotterSearchTable = new Map([
    [SearchCharts_1.TimeOfDay.Day, alliedSpotterDayResults],
    [SearchCharts_1.TimeOfDay.Night, alliedSpotterNightResults],
]);
exports.alliedAirSearchChartResults = new Map([
    [SearchCharts_1.TimeOfDay.Day, alliedAirSearchDayResults],
    [SearchCharts_1.TimeOfDay.Night, alliedAirSearchNightResults],
]);
exports.alliedSearchChartResults = new Map([
    [Interfaces_1.AircraftType.LRA, alliedLRASearchTable],
    [Interfaces_1.AircraftType.F, alliedFTBSearchTable],
    [Interfaces_1.AircraftType.T, alliedFTBSearchTable],
    [Interfaces_1.AircraftType.B, alliedFTBSearchTable],
    [Interfaces_1.AircraftType.Spotter, alliedSpotterSearchTable],
]);
