"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchChart = exports.SearchResultArray = exports.DetectionLevel = exports.TimeOfDay = void 0;
var TimeOfDay;
(function (TimeOfDay) {
    TimeOfDay["Day"] = "Day";
    TimeOfDay["Night"] = "Night";
})(TimeOfDay = exports.TimeOfDay || (exports.TimeOfDay = {}));
var DetectionLevel;
(function (DetectionLevel) {
    DetectionLevel["undetected"] = "undetected";
    DetectionLevel["detectedGreen"] = "detectedGreen";
    DetectionLevel["detectedBlue"] = "detectedBlue";
    DetectionLevel["detectedRed"] = "detectedRed";
})(DetectionLevel = exports.DetectionLevel || (exports.DetectionLevel = {}));
exports.SearchResultArray = [
    DetectionLevel.detectedGreen,
    DetectionLevel.detectedBlue,
    DetectionLevel.detectedRed,
    DetectionLevel.undetected,
];
// used for both Allied and Japanese searches...correct table plugged in via options object
class SearchChart {
    static searchForNaval(options) {
        // first get the correct table for aircraft type
        if (!options.navalSearchTable) {
            throw Error(`No naval search table provided in searchForNaval()`);
        }
        if (!options.searchingAirUnitType) {
            throw Error(`No searching air unit type provided in searchForNaval()`);
        }
        if (options.range < 0 || options.range > 8) {
            throw Error(`Range is not allowed: ${options.range}`);
        }
        const resultsForTimeOfDay = options.navalSearchTable.get(options.searchingAirUnitType);
        if (!resultsForTimeOfDay) {
            throw Error(`No result found in Search Results for Time of Day for aircraft type ${options.searchingAirUnitType}`);
        }
        // gives us the LRASearchTable
        // now get the day or night search results
        const searchResults = resultsForTimeOfDay.get(options.timeOfDay);
        if (!searchResults) {
            throw Error(`No result found in Search Results for Distance for time of day ${options.timeOfDay}`);
        }
        // gives us the LRADayResults table
        // now get the result for the range and die roll
        // first get row
        const resultRow = searchResults.get(options.range);
        if (!resultRow) {
            throw Error(`No result row found in Search Results for range ${options.range}`);
        }
        // then use the die roll to index into the row
        let result = DetectionLevel.undetected;
        if (options.DRM) {
            options.dieRoll = options.dieRoll + options.DRM;
        }
        resultRow.map((row, index) => {
            if (options.dieRoll >= row[0] && options.dieRoll <= row[row.length - 1]) {
                result = index;
                return;
            }
        });
        if (typeof (result) === 'number') {
            return exports.SearchResultArray[result];
        }
        return result;
    }
    static searchForAir(options) {
        if (!options.airSearchTable) {
            throw Error(`No air search table provided in searchForAir()`);
        }
        if (options.range != 0) {
            throw Error(`Range can only be 0 for Air Search`);
        }
        // Get the day or night search results
        const searchResults = options.airSearchTable.get(options.timeOfDay);
        if (!searchResults) {
            throw Error(`No result found in Search Results for Distance for time of day ${options.timeOfDay}`);
        }
        // now get the result for the range and die roll
        // first get row
        const resultRow = searchResults.get(options.range);
        if (!resultRow) {
            throw Error(`No result row found in Search Results for range ${options.range}`);
        }
        // then use the die roll to index into the row
        let result = DetectionLevel.undetected;
        resultRow.map((row, index) => {
            if (options.dieRoll >= row[0] && options.dieRoll <= row[row.length - 1]) {
                result = index;
                return;
            }
        });
        if (typeof (result) === 'number') {
            return exports.SearchResultArray[result];
        }
        return result;
    }
    // search for Force uses same chart as Search For Air
    static searchForForce() {
        return DetectionLevel.detectedGreen; // clarification from Mark Herman
    }
}
exports.SearchChart = SearchChart;
